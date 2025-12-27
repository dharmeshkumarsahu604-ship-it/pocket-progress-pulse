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
    // Get user from JWT
    const authHeader = req.headers.get('Authorization');
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader || '' } } }
    );
    
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { audioBase64, language } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    if (!audioBase64) {
      return new Response(
        JSON.stringify({ error: "audioBase64 is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    secureLog.info("Processing audio transcription request");

    // Use AI to transcribe the audio by analyzing it
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
                text: `Transcribe this audio recording. The recording contains geological field notes about rocks, minerals, or geological observations. 

Provide:
1. **Transcription**: Full text transcription of the audio
2. **Summary**: Brief summary of key points
3. **Keywords**: Important geological terms mentioned
4. **Confidence**: Your confidence in the transcription (0-100%)

Return as JSON:
{
  "transcription": "full text",
  "summary": "brief summary",
  "keywords": ["keyword1", "keyword2"],
  "confidence": 95,
  "language": "detected language"
}`
              },
              {
                type: "image_url",
                image_url: { url: audioBase64 }
              }
            ]
          }
        ],
        temperature: 0.2,
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
        JSON.stringify({ error: "Transcription service temporarily unavailable" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    secureLog.info("Transcription response received");

    // Try to parse JSON from the response
    let transcriptionResult;
    try {
      const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      transcriptionResult = JSON.parse(cleanContent);
    } catch (parseError) {
      // If JSON parsing fails, use the raw text
      secureLog.info("Failed to parse JSON, using text response");
      transcriptionResult = {
        transcription: content,
        summary: "Transcription completed",
        keywords: [],
        confidence: 80,
        language: language || "en"
      };
    }

    return new Response(
      JSON.stringify(transcriptionResult),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    secureLog.error("Transcription error");
    return new Response(
      JSON.stringify({ error: "Transcription service temporarily unavailable. Please try again." }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
