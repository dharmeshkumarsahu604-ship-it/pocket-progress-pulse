import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, BellOff, Clock, Sparkles, Camera, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import {
  isPushNotificationSupported,
  getNotificationPermission,
  initializePushNotifications,
  unsubscribeFromPush,
  getCurrentPushSubscription,
  getPushSubscriptionPreferences,
  updatePushSubscriptionPreferences,
  removePushSubscription
} from "@/lib/pushNotifications";

interface NotificationPreferences {
  enabled: boolean;
  dailyFactsEnabled: boolean;
  specimenRemindersEnabled: boolean;
  preferredTime: string;
}

export function NotificationSettings() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [supported, setSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    enabled: false,
    dailyFactsEnabled: true,
    specimenRemindersEnabled: true,
    preferredTime: "09:00"
  });

  useEffect(() => {
    checkNotificationStatus();
  }, [user]);

  const checkNotificationStatus = async () => {
    setLoading(true);
    
    // Check if supported
    const isSupported = isPushNotificationSupported();
    setSupported(isSupported);
    
    if (!isSupported) {
      setLoading(false);
      return;
    }

    // Check permission
    const currentPermission = getNotificationPermission();
    setPermission(currentPermission);

    // Check if user has active subscription
    const subscription = await getCurrentPushSubscription();
    
    if (user && subscription) {
      // Get preferences from database
      try {
        const dbPrefs = await getPushSubscriptionPreferences(user.id);
        if (dbPrefs) {
          setPreferences({
            enabled: true,
            dailyFactsEnabled: dbPrefs.daily_facts_enabled,
            specimenRemindersEnabled: dbPrefs.specimen_reminders_enabled,
            preferredTime: dbPrefs.preferred_time?.slice(0, 5) || "09:00"
          });
        }
      } catch (error) {
        console.error("Failed to load preferences:", error);
      }
    }

    setLoading(false);
  };

  const handleEnableNotifications = async () => {
    if (!user) {
      toast.error("Please sign in to enable notifications");
      return;
    }

    setSaving(true);
    try {
      const success = await initializePushNotifications(user.id);
      
      if (success) {
        setPreferences(prev => ({ ...prev, enabled: true }));
        setPermission("granted");
        toast.success("Notifications enabled successfully!");
      } else {
        toast.error("Failed to enable notifications. Please check your browser settings.");
      }
    } catch (error) {
      console.error("Error enabling notifications:", error);
      toast.error("Failed to enable notifications");
    } finally {
      setSaving(false);
    }
  };

  const handleDisableNotifications = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const subscription = await getCurrentPushSubscription();
      
      if (subscription) {
        await removePushSubscription(user.id, subscription.endpoint);
        await unsubscribeFromPush();
      }

      setPreferences(prev => ({ ...prev, enabled: false }));
      toast.success("Notifications disabled");
    } catch (error) {
      console.error("Error disabling notifications:", error);
      toast.error("Failed to disable notifications");
    } finally {
      setSaving(false);
    }
  };

  const handlePreferenceChange = async (
    key: keyof Omit<NotificationPreferences, "enabled">,
    value: boolean | string
  ) => {
    if (!user) return;

    const newPreferences = { ...preferences, [key]: value };
    setPreferences(newPreferences);

    try {
      await updatePushSubscriptionPreferences(user.id, {
        dailyFactsEnabled: newPreferences.dailyFactsEnabled,
        specimenRemindersEnabled: newPreferences.specimenRemindersEnabled,
        preferredTime: `${newPreferences.preferredTime}:00`
      });
    } catch (error) {
      console.error("Failed to update preferences:", error);
      toast.error("Failed to save preference");
      // Revert on error
      setPreferences(preferences);
    }
  };

  // Generate time options
  const timeOptions = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, "0");
    return `${hour}:00`;
  });

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Push Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!supported) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BellOff className="h-5 w-5" />
            Push Notifications
          </CardTitle>
          <CardDescription>
            Push notifications are not supported in this browser
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            To receive notifications, please use a modern browser like Chrome, Firefox, or Edge.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Push Notifications
          </CardTitle>
          <CardDescription>
            Sign in to manage notification preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Please sign in to enable push notifications and receive daily geology facts and specimen reminders.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Push Notifications
        </CardTitle>
        <CardDescription>
          Receive daily geology facts and specimen reminders
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Enable/Disable Toggle */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-sm font-medium">Enable Notifications</Label>
            <p className="text-xs text-muted-foreground">
              {preferences.enabled 
                ? "You're receiving push notifications" 
                : "Turn on to receive notifications"}
            </p>
          </div>
          <Switch
            checked={preferences.enabled}
            disabled={saving}
            onCheckedChange={(checked) => {
              if (checked) {
                handleEnableNotifications();
              } else {
                handleDisableNotifications();
              }
            }}
          />
        </div>

        {preferences.enabled && (
          <>
            <div className="border-t pt-4 space-y-4">
              {/* Daily Facts Toggle */}
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-amber-500/10 flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-amber-600" />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Daily Geology Facts</Label>
                    <p className="text-xs text-muted-foreground">
                      Receive a fascinating geology fact every day
                    </p>
                  </div>
                </div>
                <Switch
                  checked={preferences.dailyFactsEnabled}
                  disabled={saving}
                  onCheckedChange={(checked) => 
                    handlePreferenceChange("dailyFactsEnabled", checked)
                  }
                />
              </div>

              {/* Specimen Reminders Toggle */}
              <div className="flex items-center justify-between py-2 border-t">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                    <Camera className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Specimen Reminders</Label>
                    <p className="text-xs text-muted-foreground">
                      Reminders to scan and document specimens
                    </p>
                  </div>
                </div>
                <Switch
                  checked={preferences.specimenRemindersEnabled}
                  disabled={saving}
                  onCheckedChange={(checked) => 
                    handlePreferenceChange("specimenRemindersEnabled", checked)
                  }
                />
              </div>

              {/* Preferred Time */}
              <div className="flex items-center justify-between py-2 border-t">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-secondary/50 flex items-center justify-center">
                    <Clock className="h-4 w-4 text-secondary-foreground" />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Preferred Time</Label>
                    <p className="text-xs text-muted-foreground">
                      When you'd like to receive notifications
                    </p>
                  </div>
                </div>
                <Select
                  value={preferences.preferredTime}
                  onValueChange={(value) => 
                    handlePreferenceChange("preferredTime", value)
                  }
                  disabled={saving}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timeOptions.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {permission === "denied" && (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                <p className="font-medium">Notifications blocked</p>
                <p className="text-xs mt-1">
                  Please enable notifications in your browser settings to receive push notifications.
                </p>
              </div>
            )}
          </>
        )}

        {!preferences.enabled && permission !== "denied" && (
          <Button 
            onClick={handleEnableNotifications} 
            disabled={saving}
            className="w-full"
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enabling...
              </>
            ) : (
              <>
                <Bell className="mr-2 h-4 w-4" />
                Enable Push Notifications
              </>
            )}
          </Button>
        )}

        {permission === "denied" && !preferences.enabled && (
          <div className="rounded-lg bg-amber-500/10 p-3 text-sm">
            <p className="font-medium text-amber-600">Notifications blocked</p>
            <p className="text-xs mt-1 text-muted-foreground">
              To enable notifications, click the lock icon in your browser's address bar and allow notifications for this site.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
