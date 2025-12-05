import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get user from JWT
    const authHeader = req.headers.get('Authorization');
    console.log('Auth header present:', !!authHeader);
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader || '' } } }
    );
    
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    
    if (authError) {
      console.error('Auth error in identify-specimen:', authError);
      return new Response(
        JSON.stringify({ error: "Unauthorized", details: authError.message }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    if (!user) {
      console.error('No user found in identify-specimen');
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log('User authenticated:', user.id);

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

    console.log("Processing specimen identification request for user:", user.id);

    // Construct image content
    const imageContent = imageUrl 
      ? { type: "image_url", image_url: { url: imageUrl } }
      : { type: "image_url", image_url: { url: imageBase64 } };

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
                text: `Analyze this geological specimen image and provide a detailed identification. Include:

1. **Specimen Name**: Most likely rock or mineral name
2. **Type**: Rock type (igneous/sedimentary/metamorphic) or mineral classification
3. **Confidence**: Your confidence level (0-100%)
4. **Key Features**: Observable characteristics that support the identification
5. **Composition**: Main components or minerals present
6. **Formation**: How it forms in nature
7. **Common Locations**: Where specimens like this are typically found
8. **Additional Notes**: Any other relevant geological information

Return your response as a valid JSON object with this structure:
{
  "name": "specimen name",
  "type": "rock or mineral type",
  "confidence": 85,
  "description": "detailed description",
  "composition": "main components",
  "texture": "texture description",
  "color": "color description",
  "formation": "formation process",
  "locations": ["location1", "location2"],
  "keyFeatures": ["feature1", "feature2"],
  "additionalNotes": "other relevant information"
}

Be specific and scientifically accurate. If you're uncertain, mention alternative possibilities.`
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
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
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

    console.log("AI Response:", content);

    // Try to parse JSON from the response
    let identification;
    try {
      // Remove markdown code blocks if present
      const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      identification = JSON.parse(cleanContent);
    } catch (parseError) {
      // If JSON parsing fails, create a structured response from text
      console.log("Failed to parse JSON, using text response");
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
    console.error("Identification error:", error instanceof Error ? error.message : "Unknown error", error);
    return new Response(
      JSON.stringify({ error: "Identification service temporarily unavailable. Please try again." }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
