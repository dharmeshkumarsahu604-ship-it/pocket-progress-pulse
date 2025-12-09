import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Camera, Mic, HardDrive, MapPin, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

type PermissionStatus = "granted" | "denied" | "prompt" | "unsupported";

interface PermissionState {
  camera: PermissionStatus;
  microphone: PermissionStatus;
  location: PermissionStatus;
  notifications: PermissionStatus;
}

export default function Settings() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("geo-smart-dark-mode");
    return saved ? JSON.parse(saved) : false;
  });
  
  const [permissions, setPermissions] = useState<PermissionState>({
    camera: "prompt",
    microphone: "prompt",
    location: "prompt",
    notifications: "prompt",
  });

  // Check all permissions on mount
  const checkPermissions = useCallback(async () => {
    const newPermissions: PermissionState = {
      camera: "prompt",
      microphone: "prompt",
      location: "prompt",
      notifications: "prompt",
    };

    try {
      // Check camera permission
      if (navigator.permissions) {
        try {
          const camera = await navigator.permissions.query({ name: "camera" as PermissionName });
          newPermissions.camera = camera.state as PermissionStatus;
        } catch {
          newPermissions.camera = "unsupported";
        }

        // Check microphone permission
        try {
          const mic = await navigator.permissions.query({ name: "microphone" as PermissionName });
          newPermissions.microphone = mic.state as PermissionStatus;
        } catch {
          newPermissions.microphone = "unsupported";
        }

        // Check location permission
        try {
          const geo = await navigator.permissions.query({ name: "geolocation" });
          newPermissions.location = geo.state as PermissionStatus;
        } catch {
          newPermissions.location = "unsupported";
        }
      }

      // Check notification permission
      if ("Notification" in window) {
        newPermissions.notifications = Notification.permission as PermissionStatus;
      } else {
        newPermissions.notifications = "unsupported";
      }
    } catch (error) {
      console.error("Error checking permissions:", error);
    }

    setPermissions(newPermissions);
  }, []);

  useEffect(() => {
    checkPermissions();
  }, [checkPermissions]);

  // Apply dark mode on mount
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Handle dark mode toggle
  const handleDarkModeChange = (checked: boolean) => {
    setDarkMode(checked);
    localStorage.setItem("geo-smart-dark-mode", JSON.stringify(checked));
    
    if (checked) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    
    toast.success(checked ? "Dark mode enabled" : "Light mode enabled");
  };

  // Request camera permission
  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      setPermissions(prev => ({ ...prev, camera: "granted" }));
      toast.success("Camera permission granted");
    } catch (error) {
      setPermissions(prev => ({ ...prev, camera: "denied" }));
      toast.error("Camera permission denied");
    }
  };

  // Request microphone permission
  const requestMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      setPermissions(prev => ({ ...prev, microphone: "granted" }));
      toast.success("Microphone permission granted");
    } catch (error) {
      setPermissions(prev => ({ ...prev, microphone: "denied" }));
      toast.error("Microphone permission denied");
    }
  };

  // Request location permission
  const requestLocationPermission = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      () => {
        setPermissions(prev => ({ ...prev, location: "granted" }));
        toast.success("Location permission granted");
      },
      () => {
        setPermissions(prev => ({ ...prev, location: "denied" }));
        toast.error("Location permission denied");
      }
    );
  };

  // Request notification permission
  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
      toast.error("Notifications not supported");
      return;
    }

    const result = await Notification.requestPermission();
    setPermissions(prev => ({ ...prev, notifications: result as PermissionStatus }));
    
    if (result === "granted") {
      toast.success("Notification permission granted");
    } else {
      toast.error("Notification permission denied");
    }
  };

  const getStatusBadge = (status: PermissionStatus) => {
    switch (status) {
      case "granted":
        return <Badge className="bg-green-500/10 text-green-600 border-green-500/20">Granted</Badge>;
      case "denied":
        return <Badge variant="destructive" className="bg-destructive/10">Denied</Badge>;
      case "unsupported":
        return <Badge variant="secondary">Unsupported</Badge>;
      default:
        return <Badge variant="outline">Not Set</Badge>;
    }
  };

  const isPermissionActionable = (status: PermissionStatus) => {
    return status === "prompt" || status === "denied";
  };

  return (
    <AppLayout>
      <div className="space-y-6 max-w-2xl mx-auto">
        <Button variant="ghost" onClick={() => navigate("/profile")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Profile
        </Button>

        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your app preferences</p>
        </div>

        {/* Permissions Section */}
        <Card>
          <CardHeader>
            <CardTitle>Permissions</CardTitle>
            <CardDescription>
              Manage app access to device features
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Camera Permission */}
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                  <Camera className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <Label className="text-sm font-medium">Camera</Label>
                  <p className="text-xs text-muted-foreground">Required for specimen scanning</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(permissions.camera)}
                {isPermissionActionable(permissions.camera) && (
                  <Button size="sm" variant="outline" onClick={requestCameraPermission}>
                    Enable
                  </Button>
                )}
              </div>
            </div>

            {/* Microphone Permission */}
            <div className="flex items-center justify-between py-2 border-t">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-accent/50 flex items-center justify-center">
                  <Mic className="h-4 w-4 text-accent-foreground" />
                </div>
                <div>
                  <Label className="text-sm font-medium">Microphone</Label>
                  <p className="text-xs text-muted-foreground">Required for voice notes</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(permissions.microphone)}
                {isPermissionActionable(permissions.microphone) && (
                  <Button size="sm" variant="outline" onClick={requestMicrophonePermission}>
                    Enable
                  </Button>
                )}
              </div>
            </div>

            {/* Location Permission */}
            <div className="flex items-center justify-between py-2 border-t">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-secondary/50 flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-secondary-foreground" />
                </div>
                <div>
                  <Label className="text-sm font-medium">Location</Label>
                  <p className="text-xs text-muted-foreground">Required for field notes GPS tagging</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(permissions.location)}
                {isPermissionActionable(permissions.location) && (
                  <Button size="sm" variant="outline" onClick={requestLocationPermission}>
                    Enable
                  </Button>
                )}
              </div>
            </div>

            {/* Notifications Permission */}
            <div className="flex items-center justify-between py-2 border-t">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center">
                  <Bell className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <Label className="text-sm font-medium">Notifications</Label>
                  <p className="text-xs text-muted-foreground">Receive updates and reminders</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(permissions.notifications)}
                {isPermissionActionable(permissions.notifications) && (
                  <Button size="sm" variant="outline" onClick={requestNotificationPermission}>
                    Enable
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>
              Customize the app appearance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="dark-mode" className="flex-1">
                Dark Mode
              </Label>
              <Switch
                id="dark-mode"
                checked={darkMode}
                onCheckedChange={handleDarkModeChange}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HardDrive className="h-5 w-5" />
              Data & Storage
            </CardTitle>
            <CardDescription>
              Manage your stored data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full">
              Clear Cache
            </Button>
            <Button variant="outline" className="w-full">
              Export Data
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>About</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <div className="flex justify-between">
              <span>Version</span>
              <span className="font-medium">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span>Build</span>
              <span className="font-medium">2024.01</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
