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

    // Combined prompt that handles both cases intelligently
    const IDENTIFICATION_PROMPT = `You are a professional geologist. Analyze this geological specimen image.

STEP 1 - TEXT DETECTION:
First, check if there is any readable text (label, name tag, or handwritten text) in the image.

IF TEXT/LABEL IS DETECTED:
- Read the text and use it as the specimen name
- Verify if the specimen visually matches the text/label name
- If there's a mismatch between the label and what you see, warn the user
- Set "labelDetected": true and include "labelText" and "verification" fields

IF NO TEXT/LABEL IS DETECTED:
- DO NOT guess exact mineral name unless you are very confident
- If unsure, return a mineral GROUP or ROCK TYPE instead of specific name
- Use visual features only for analysis
- Set "labelDetected": false

ANALYZE BASED ON (for visual identification):
- Color
- Grain size
- Texture
- Luster
- Crystal shape (if visible)

IMPORTANT RULES:
- Be scientifically rigorous
- If confidence is low, provide mineral/rock GROUP rather than exact name
- Always note that user should verify with hardness/streak tests when uncertain

Return your response as a valid JSON object with this structure:
{
  "name": "specimen name or mineral group/rock type",
  "type": "rock type (igneous/sedimentary/metamorphic) or mineral classification",
  "confidence": 75,
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
  "labelDetected": true or false,
  "labelText": "text found in image (if any, otherwise null)",
  "verification": "match" | "mismatch" | "no_label",
  "verificationNote": "explanation if mismatch detected or null",
  "requiresVerification": "User should verify with hardness/streak test" (include when confidence is low/medium)
}

Be specific and scientifically accurate. When uncertain, err on the side of caution and suggest verification tests.`;

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
              {
                type: "text",
                text: IDENTIFICATION_PROMPT
              },
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
