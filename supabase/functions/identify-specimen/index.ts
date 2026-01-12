import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Environment-gated logging - only log in development
const isDev = Deno.env.get('ENVIRONMENT') === 'development';
const secureLog = {
  info: (...args: unknown[]) => isDev && console.log(...args),
  error: (msg: string) => console.error(isDev ? msg : 'Service error'),
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get authorization header
    const authHeader = req.headers.get('Authorization');
    
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Authorization header required" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );
    
    // Use getUser without arguments - it will use the auth header from the client
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    
    if (authError) {
      secureLog.error('Auth error in identify-specimen');
      return new Response(
        JSON.stringify({ error: "Authentication failed. Please sign in again." }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    if (!user) {
      return new Response(
        JSON.stringify({ error: "User not found. Please sign in again." }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    secureLog.info('User authenticated for specimen identification');

    const { imageUrl, imageBase64 } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    if (!imageUrl && !imageBase64) {
      return new Response(
        JSON.stringify({ error: "Either imageUrl or imageBase64 is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    secureLog.info("Processing specimen identification request");

    // Construct image content
    const imageContent = imageUrl 
      ? { type: "image_url", image_url: { url: imageUrl } }
      : { type: "image_url", image_url: { url: imageBase64 } };

    // Helper function to check if meaningful text was detected
    const hasTextDetected = (ocrText: string | null | undefined): boolean => {
      return ocrText !== null && ocrText !== undefined && ocrText.trim().length > 3;
    };

    // PHASE 1: Quick OCR/text detection
    const OCR_DETECTION_PROMPT = `Look at this image and extract any visible text (labels, name tags, handwritten notes, or printed text).
Return ONLY a JSON object:
{
  "hasText": true or false,
  "detectedText": "the text you found" or null
}
If no text is visible, return {"hasText": false, "detectedText": null}`;

    const ocrResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: OCR_DETECTION_PROMPT },
              imageContent
            ]
          }
        ],
        temperature: 0.1,
      }),
    });

    let ocrResult: string | null = null;
    
    if (ocrResponse.ok) {
      const ocrData = await ocrResponse.json();
      const ocrContent = ocrData.choices?.[0]?.message?.content;
      try {
        const cleanOcr = ocrContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const ocrParsed = JSON.parse(cleanOcr);
        if (ocrParsed.hasText && ocrParsed.detectedText) {
          ocrResult = ocrParsed.detectedText;
        }
      } catch {
        secureLog.info("OCR parsing failed, proceeding without text detection");
      }
    }

    secureLog.info(`Text detection result: ${hasTextDetected(ocrResult) ? 'Text found' : 'No text'}`);

    // PHASE 2: Use appropriate prompt based on OCR result
    const PROMPT_WITH_TEXT = `You are a geology identification assistant.
The specimen has a label/text: "${ocrResult}"

TASK:
1. Use the label text as the specimen name
2. Verify if the specimen visually matches the labeled name
3. If there's a mismatch, warn the user

Return JSON:
{
  "name": "${ocrResult}",
  "type": "rock type (igneous/sedimentary/metamorphic) or mineral classification",
  "confidence": 85,
  "confidenceLevel": "high",
  "description": "detailed description",
  "composition": "main components",
  "texture": "texture description",
  "color": "color description",
  "formation": "formation process",
  "locations": ["location1", "location2"],
  "keyFeatures": ["feature1", "feature2"],
  "possibleExamples": [],
  "additionalNotes": "other relevant information",
  "labelDetected": true,
  "labelText": "${ocrResult}",
  "verification": "match" or "mismatch",
  "verificationNote": "explanation if mismatch detected"
}

If the specimen doesn't match the label, set verification to "mismatch" and explain why.`;

    const PROMPT_WITHOUT_TEXT = `You are a professional geologist.

IMPORTANT RULES:
- DO NOT guess exact mineral name unless very confident
- If unsure, return a mineral GROUP or ROCK TYPE
- Use visual features only

ANALYZE BASED ON:
- Color
- Grain size
- Texture
- Luster
- Crystal shape (if visible)

Return JSON:
{
  "name": "mineral group or rock type (be conservative)",
  "type": "rock type (igneous/sedimentary/metamorphic) or mineral classification",
  "confidence": 60,
  "confidenceLevel": "low" | "medium" | "high",
  "description": "detailed description",
  "composition": "main components",
  "texture": "texture description",
  "color": "color description",
  "formation": "formation process",
  "locations": ["location1", "location2"],
  "keyFeatures": ["feature1", "feature2"],
  "possibleExamples": ["possible mineral 1", "possible mineral 2"],
  "additionalNotes": "other relevant information",
  "labelDetected": false,
  "labelText": null,
  "verification": "no_label",
  "verificationNote": null,
  "requiresVerification": "User must verify with hardness/streak test"
}

If confidence is low, DO NOT give exact mineral name - give the GROUP instead.`;

    // Select prompt based on OCR result
    const identificationPrompt = hasTextDetected(ocrResult) ? PROMPT_WITH_TEXT : PROMPT_WITHOUT_TEXT;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: identificationPrompt },
              imageContent
            ]
          }
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please contact support." }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      secureLog.error("AI gateway error");
      return new Response(
        JSON.stringify({ error: "AI service temporarily unavailable" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    secureLog.info("AI response received");

    // Try to parse JSON from the response
    let identification;
    try {
      // Remove markdown code blocks if present
      const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      identification = JSON.parse(cleanContent);
    } catch (parseError) {
      // If JSON parsing fails, create a structured response from text
      secureLog.info("Failed to parse JSON, using text response");
      identification = {
        name: "Unknown Specimen",
        type: "Unknown",
        confidence: 50,
        description: content,
        composition: "Analysis in progress",
        texture: "See description",
        color: "See description",
        formation: "See description",
        locations: [],
        keyFeatures: [],
        additionalNotes: content
      };
    }

    return new Response(
      JSON.stringify(identification),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    secureLog.error("Identification error");
    return new Response(
      JSON.stringify({ error: "Identification service temporarily unavailable. Please try again." }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
