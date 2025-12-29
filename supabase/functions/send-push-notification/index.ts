import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PushPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: Record<string, unknown>;
}

interface NotificationRequest {
  userId?: string;
  userIds?: string[];
  type?: 'daily_fact' | 'specimen_reminder' | 'custom';
  payload: PushPayload;
}

// Web Push implementation using VAPID
async function sendWebPush(
  subscription: { endpoint: string; p256dh_key: string; auth_key: string },
  payload: PushPayload,
  vapidKeys: { publicKey: string; privateKey: string; subject: string }
): Promise<boolean> {
  try {
    // Import the web-push-libs for Deno
    const encoder = new TextEncoder();
    
    // Create the JWT for VAPID
    const header = { typ: 'JWT', alg: 'ES256' };
    const now = Math.floor(Date.now() / 1000);
    const claims = {
      aud: new URL(subscription.endpoint).origin,
      exp: now + 12 * 60 * 60, // 12 hours
      sub: vapidKeys.subject
    };

    // Base64url encode
    const base64urlEncode = (data: Uint8Array | string): string => {
      const str = typeof data === 'string' ? data : String.fromCharCode(...data);
      return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    };

    const headerB64 = base64urlEncode(JSON.stringify(header));
    const claimsB64 = base64urlEncode(JSON.stringify(claims));
    const unsignedToken = `${headerB64}.${claimsB64}`;

    // Import the private key for signing
    const privateKeyBase64 = vapidKeys.privateKey
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    const privateKeyBytes = Uint8Array.from(atob(privateKeyBase64), c => c.charCodeAt(0));
    
    // Create the key for signing
    const cryptoKey = await crypto.subtle.importKey(
      'pkcs8',
      privateKeyBytes,
      { name: 'ECDSA', namedCurve: 'P-256' },
      false,
      ['sign']
    ).catch(async () => {
      // Try raw format if PKCS8 fails
      const rawKey = await crypto.subtle.importKey(
        'raw',
        privateKeyBytes,
        { name: 'ECDSA', namedCurve: 'P-256' },
        false,
        ['sign']
      );
      return rawKey;
    });

    // Sign the token
    const signature = await crypto.subtle.sign(
      { name: 'ECDSA', hash: 'SHA-256' },
      cryptoKey,
      encoder.encode(unsignedToken)
    );

    const signatureB64 = base64urlEncode(new Uint8Array(signature));
    const jwt = `${unsignedToken}.${signatureB64}`;

    // Prepare the payload
    const payloadString = JSON.stringify(payload);
    const payloadBytes = encoder.encode(payloadString);

    // Send the push notification
    const response = await fetch(subscription.endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `vapid t=${jwt}, k=${vapidKeys.publicKey}`,
        'Content-Type': 'application/octet-stream',
        'Content-Encoding': 'aes128gcm',
        'TTL': '86400',
        'Urgency': 'normal'
      },
      body: payloadBytes
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Push failed: ${response.status} - ${errorText}`);
      
      // Handle expired subscriptions (410 Gone)
      if (response.status === 410) {
        return false; // Subscription is no longer valid
      }
      
      return false;
    }

    console.log('Push notification sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending push notification:', error);
    return false;
  }
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const vapidPublicKey = Deno.env.get('VAPID_PUBLIC_KEY');
    const vapidPrivateKey = Deno.env.get('VAPID_PRIVATE_KEY');
    const vapidSubject = Deno.env.get('VAPID_SUBJECT');

    if (!vapidPublicKey || !vapidPrivateKey || !vapidSubject) {
      console.error('VAPID keys not configured');
      return new Response(
        JSON.stringify({ error: 'Push notifications not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const body: NotificationRequest = await req.json();

    console.log('Received push notification request:', JSON.stringify(body, null, 2));

    // Determine which users to notify
    let userIds: string[] = [];
    
    if (body.userId) {
      userIds = [body.userId];
    } else if (body.userIds) {
      userIds = body.userIds;
    } else if (body.type === 'daily_fact') {
      // Get all users with daily facts enabled
      const { data: subscriptions } = await supabase
        .from('push_subscriptions')
        .select('user_id')
        .eq('daily_facts_enabled', true);
      
      userIds = [...new Set(subscriptions?.map(s => s.user_id) || [])];
    } else if (body.type === 'specimen_reminder') {
      // Get all users with specimen reminders enabled
      const { data: subscriptions } = await supabase
        .from('push_subscriptions')
        .select('user_id')
        .eq('specimen_reminders_enabled', true);
      
      userIds = [...new Set(subscriptions?.map(s => s.user_id) || [])];
    }

    if (userIds.length === 0) {
      return new Response(
        JSON.stringify({ success: true, sent: 0, message: 'No users to notify' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get subscriptions for all target users
    const { data: subscriptions, error: subError } = await supabase
      .from('push_subscriptions')
      .select('*')
      .in('user_id', userIds);

    if (subError) {
      console.error('Error fetching subscriptions:', subError);
      throw subError;
    }

    if (!subscriptions || subscriptions.length === 0) {
      return new Response(
        JSON.stringify({ success: true, sent: 0, message: 'No subscriptions found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Sending notifications to ${subscriptions.length} subscriptions`);

    // Send notifications to all subscriptions
    const vapidKeys = {
      publicKey: vapidPublicKey,
      privateKey: vapidPrivateKey,
      subject: vapidSubject
    };

    const results = await Promise.all(
      subscriptions.map(async (sub) => {
        const success = await sendWebPush(
          {
            endpoint: sub.endpoint,
            p256dh_key: sub.p256dh_key,
            auth_key: sub.auth_key
          },
          body.payload,
          vapidKeys
        );

        // Remove invalid subscriptions
        if (!success) {
          await supabase
            .from('push_subscriptions')
            .delete()
            .eq('id', sub.id);
        }

        return success;
      })
    );

    const successCount = results.filter(Boolean).length;

    return new Response(
      JSON.stringify({ 
        success: true, 
        sent: successCount, 
        total: subscriptions.length 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in send-push-notification:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
