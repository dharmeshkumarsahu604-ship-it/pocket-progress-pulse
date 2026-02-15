import { supabase } from "@/integrations/supabase/client";

// VAPID public key - must match the one in edge function
const VAPID_PUBLIC_KEY = 'YOUR_VAPID_PUBLIC_KEY'; // Will be replaced with actual key from secrets

export interface PushSubscriptionData {
  endpoint: string;
  p256dh_key: string;
  auth_key: string;
}

/**
 * Check if push notifications are supported
 */
export function isPushNotificationSupported(): boolean {
  return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
}

/**
 * Get the current notification permission status
 */
export function getNotificationPermission(): NotificationPermission {
  if (!('Notification' in window)) {
    return 'denied';
  }
  return Notification.permission;
}

/**
 * Request notification permission
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    throw new Error('Notifications not supported');
  }
  
  const permission = await Notification.requestPermission();
  return permission;
}

/**
 * Register the service worker
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration> {
  if (!('serviceWorker' in navigator)) {
    throw new Error('Service workers not supported');
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/'
    });
    
    console.log('Service Worker registered:', registration.scope);
    return registration;
  } catch (error) {
    console.error('Service Worker registration failed:', error);
    throw error;
  }
}

/**
 * Get the active service worker registration
 */
export async function getServiceWorkerRegistration(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) {
    return null;
  }
  
  return navigator.serviceWorker.ready;
}

/**
 * Convert a base64 string to Uint8Array for VAPID key
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/**
 * Subscribe to push notifications
 */
export async function subscribeToPush(vapidPublicKey?: string): Promise<PushSubscriptionData | null> {
  try {
    const registration = await getServiceWorkerRegistration();
    if (!registration) {
      throw new Error('Service worker not registered');
    }

    // Check for existing subscription
    let subscription = await (registration as any).pushManager.getSubscription();
    
    // If no subscription exists, create one
    if (!subscription) {
      const key = vapidPublicKey || VAPID_PUBLIC_KEY;
      
      if (!key || key === 'YOUR_VAPID_PUBLIC_KEY') {
        throw new Error('VAPID public key not configured');
      }

      const applicationServerKey = urlBase64ToUint8Array(key);
      subscription = await (registration as any).pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey.buffer as ArrayBuffer
      });
    }

    // Extract the keys from the subscription
    const p256dh = subscription.getKey('p256dh');
    const auth = subscription.getKey('auth');

    if (!p256dh || !auth) {
      throw new Error('Failed to get subscription keys');
    }

    return {
      endpoint: subscription.endpoint,
      p256dh_key: btoa(String.fromCharCode(...new Uint8Array(p256dh))),
      auth_key: btoa(String.fromCharCode(...new Uint8Array(auth)))
    };
  } catch (error) {
    console.error('Failed to subscribe to push:', error);
    throw error;
  }
}

/**
 * Unsubscribe from push notifications
 */
export async function unsubscribeFromPush(): Promise<boolean> {
  try {
    const registration = await getServiceWorkerRegistration();
    if (!registration) {
      return false;
    }

    const subscription = await (registration as any).pushManager.getSubscription();
    if (subscription) {
      await subscription.unsubscribe();
      return true;
    }
    return false;
  } catch (error) {
    console.error('Failed to unsubscribe from push:', error);
    throw error;
  }
}

/**
 * Get current push subscription
 */
export async function getCurrentPushSubscription(): Promise<PushSubscription | null> {
  try {
    const registration = await getServiceWorkerRegistration();
    if (!registration) {
      return null;
    }
    return (registration as any).pushManager.getSubscription();
  } catch (error) {
    console.error('Failed to get current subscription:', error);
    return null;
  }
}

/**
 * Save push subscription to Supabase
 */
export async function savePushSubscription(
  userId: string,
  subscriptionData: PushSubscriptionData,
  preferences?: {
    dailyFactsEnabled?: boolean;
    specimenRemindersEnabled?: boolean;
    preferredTime?: string;
  }
): Promise<void> {
  const { error } = await supabase
    .from('push_subscriptions')
    .upsert({
      user_id: userId,
      endpoint: subscriptionData.endpoint,
      p256dh_key: subscriptionData.p256dh_key,
      auth_key: subscriptionData.auth_key,
      daily_facts_enabled: preferences?.dailyFactsEnabled ?? true,
      specimen_reminders_enabled: preferences?.specimenRemindersEnabled ?? true,
      preferred_time: preferences?.preferredTime ?? '09:00:00'
    }, {
      onConflict: 'user_id,endpoint'
    });

  if (error) {
    console.error('Failed to save push subscription:', error);
    throw error;
  }
}

/**
 * Remove push subscription from Supabase
 */
export async function removePushSubscription(userId: string, endpoint: string): Promise<void> {
  const { error } = await supabase
    .from('push_subscriptions')
    .delete()
    .eq('user_id', userId)
    .eq('endpoint', endpoint);

  if (error) {
    console.error('Failed to remove push subscription:', error);
    throw error;
  }
}

/**
 * Get user's push subscription preferences
 */
export async function getPushSubscriptionPreferences(userId: string) {
  const { data, error } = await supabase
    .from('push_subscriptions')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.error('Failed to get push subscription preferences:', error);
    throw error;
  }

  return data;
}

/**
 * Update push subscription preferences
 */
export async function updatePushSubscriptionPreferences(
  userId: string,
  preferences: {
    dailyFactsEnabled?: boolean;
    specimenRemindersEnabled?: boolean;
    preferredTime?: string;
  }
): Promise<void> {
  const updateData: Record<string, unknown> = {};
  
  if (preferences.dailyFactsEnabled !== undefined) {
    updateData.daily_facts_enabled = preferences.dailyFactsEnabled;
  }
  if (preferences.specimenRemindersEnabled !== undefined) {
    updateData.specimen_reminders_enabled = preferences.specimenRemindersEnabled;
  }
  if (preferences.preferredTime !== undefined) {
    updateData.preferred_time = preferences.preferredTime;
  }

  const { error } = await supabase
    .from('push_subscriptions')
    .update(updateData)
    .eq('user_id', userId);

  if (error) {
    console.error('Failed to update push subscription preferences:', error);
    throw error;
  }
}

/**
 * Initialize push notifications for a user
 */
export async function initializePushNotifications(userId: string, vapidPublicKey?: string): Promise<boolean> {
  try {
    // Check if supported
    if (!isPushNotificationSupported()) {
      console.log('Push notifications not supported');
      return false;
    }

    // Request permission
    const permission = await requestNotificationPermission();
    if (permission !== 'granted') {
      console.log('Notification permission denied');
      return false;
    }

    // Register service worker
    await registerServiceWorker();

    // Subscribe to push
    const subscriptionData = await subscribeToPush(vapidPublicKey);
    if (!subscriptionData) {
      throw new Error('Failed to get subscription data');
    }

    // Save to database
    await savePushSubscription(userId, subscriptionData);

    console.log('Push notifications initialized successfully');
    return true;
  } catch (error) {
    console.error('Failed to initialize push notifications:', error);
    return false;
  }
}
