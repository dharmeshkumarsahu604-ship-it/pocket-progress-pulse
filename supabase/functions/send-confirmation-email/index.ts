import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const sendEmail = async (to: string, subject: string, html: string) => {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: "Geo-Smart <noreply@geosmart.site>",
      to: [to],
      subject,
      html,
    }),
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to send email: ${error}`);
  }
  
  return response.json();
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  email: string;
  name: string;
  type: "signup" | "welcome";
  confirmationUrl?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, name, type, confirmationUrl }: EmailRequest = await req.json();

    console.log(`Sending ${type} email to: ${email}`);

    let subject: string;
    let html: string;

    if (type === "signup" && confirmationUrl) {
      subject = "Verify your Geo-Smart account";
      html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Email</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #8B4513 0%, #4682B4 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🪨 Geo-Smart</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Your AI-Powered Geological Companion</p>
          </div>
          
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0; border-top: none;">
            <h2 style="color: #8B4513; margin-top: 0;">Welcome, ${name}! 👋</h2>
            
            <p>Thank you for signing up for Geo-Smart! We're excited to have you join our community of geology enthusiasts.</p>
            
            <p>Please verify your email address by clicking the button below:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${confirmationUrl}" style="background: #8B4513; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Verify Email Address</a>
            </div>
            
            <p style="color: #666; font-size: 14px;">If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="color: #4682B4; font-size: 12px; word-break: break-all;">${confirmationUrl}</p>
            
            <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
            
            <p style="color: #888; font-size: 12px; text-align: center;">
              If you didn't create an account with Geo-Smart, you can safely ignore this email.
            </p>
          </div>
          
          <div style="text-align: center; padding: 20px; color: #888; font-size: 12px;">
            <p>© 2024 Geo-Smart. All rights reserved.</p>
          </div>
        </body>
        </html>
      `;
    } else {
      subject = "Welcome to Geo-Smart!";
      html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Geo-Smart</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #8B4513 0%, #4682B4 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🪨 Geo-Smart</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Your AI-Powered Geological Companion</p>
          </div>
          
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0; border-top: none;">
            <h2 style="color: #8B4513; margin-top: 0;">Welcome aboard, ${name}! 🎉</h2>
            
            <p>Your Geo-Smart account is now active! Here's what you can do:</p>
            
            <ul style="padding-left: 20px;">
              <li><strong>AI Rock Scanner</strong> - Identify specimens instantly with AI</li>
              <li><strong>Rock & Mineral Database</strong> - Explore comprehensive geological data</li>
              <li><strong>Field Notes</strong> - Document your geological discoveries</li>
              <li><strong>Geological Sites</strong> - Discover amazing locations across India</li>
              <li><strong>Digital Compass</strong> - Professional geological measurements</li>
            </ul>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://gknkwiwfwzjfcijjrlac.lovable.app" style="background: #4682B4; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Start Exploring</a>
            </div>
            
            <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
            
            <p style="color: #888; font-size: 12px; text-align: center;">
              Happy exploring! 🌍
            </p>
          </div>
          
          <div style="text-align: center; padding: 20px; color: #888; font-size: 12px;">
            <p>© 2024 Geo-Smart. All rights reserved.</p>
          </div>
        </body>
        </html>
      `;
    }

    const emailResponse = await sendEmail(email, subject, html);
    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-confirmation-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
