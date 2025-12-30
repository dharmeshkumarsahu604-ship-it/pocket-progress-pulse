import { useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  User, Mail, LogOut, Settings, Building2, Camera, RefreshCw, 
  Pencil, X, Check, ChevronRight, Bell, Shield, Scan, FileText, 
  Mic, Bookmark, Award, Compass, Mountain
} from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { profileSchema } from "@/lib/validation";
import secureLog from "@/lib/secureLogger";

interface UserProfile {
  full_name: string;
  institute: string | null;
  bio: string | null;
  avatar_url?: string | null;
}

interface UserStats {
  total_scans: number;
  total_field_notes: number;
  total_voice_notes: number;
  total_bookmarks: number;
}

interface Achievement {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  unlocked: boolean;
}

export default function Profile() {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [userRole, setUserRole] = useState<string>("student");
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [refreshingStats, setRefreshingStats] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({ full_name: "", bio: "", institute: "" });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchStats = async () => {
    if (!user) return;
    const { data } = await supabase.rpc("get_user_stats", { user_uuid: user.id });
    if (data && data[0]) setStats(data[0]);
  };

  const handleRefreshStats = async () => {
    setRefreshingStats(true);
    await fetchStats();
    setRefreshingStats(false);
    toast.success("Statistics updated");
  };

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        const [profileResult, roleResult, statsResult] = await Promise.all([
          supabase
            .from("profiles")
            .select("full_name, institute, bio, avatar_url")
            .eq("id", user.id)
            .single(),
          supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", user.id)
            .single(),
          supabase.rpc("get_user_stats", { user_uuid: user.id })
        ]);

        if (profileResult.data) setProfile(profileResult.data);
        if (roleResult.data) setUserRole(roleResult.data.role);
        if (statsResult.data && statsResult.data[0]) setStats(statsResult.data[0]);
      } catch (error) {
        // Error fetching profile - will use user metadata as fallback
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const userMetadata = user?.user_metadata || {};
  const fullName = profile?.full_name || userMetadata.full_name || "User";
  const role = userRole;

  const handleSignOut = async () => {
    await signOut();
  };

  const handleEditClick = () => {
    setEditForm({
      full_name: profile?.full_name || fullName,
      bio: profile?.bio || "",
      institute: profile?.institute || "",
    });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    
    const validation = profileSchema.safeParse({
      fullName: editForm.full_name,
      bio: editForm.bio,
      institute: editForm.institute,
    });

    if (!validation.success) {
      toast.error(validation.error.issues[0]?.message || 'Invalid profile data');
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          full_name: validation.data.fullName,
          bio: validation.data.bio || null,
          institute: validation.data.institute || null,
          avatar_url: profile?.avatar_url || null,
        });

      if (error) throw error;

      setProfile(prev => ({
        ...prev,
        full_name: validation.data.fullName,
        bio: validation.data.bio || null,
        institute: validation.data.institute || null,
        avatar_url: prev?.avatar_url || null,
      }));
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update profile';
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (!file.type.startsWith('image/')) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    try {
      setUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) {
        secureLog.error("Upload error", uploadError);
        toast.error("Upload failed. Please try again.");
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from('profiles')
        .upsert({ 
          id: user.id,
          avatar_url: publicUrl,
          full_name: fullName,
        })
        .eq('id', user.id);

      if (updateError) {
        secureLog.error("Update error", updateError);
        toast.error("Profile update failed. Please try again.");
        return;
      }

      setProfile(prev => prev ? { ...prev, avatar_url: publicUrl } : { 
        full_name: fullName, 
        institute: null, 
        bio: null, 
        avatar_url: publicUrl 
      });
      toast.success("Profile picture updated successfully!");
    } catch (error: unknown) {
      secureLog.error("Error uploading avatar", error);
      toast.error("Failed to upload profile picture");
    } finally {
      setUploading(false);
    }
  };

  // Generate achievements based on stats
  const achievements: Achievement[] = [
    {
      id: "first-scan",
      icon: <Scan className="h-5 w-5" />,
      title: "First Specimen Scanned",
      description: "Started your geological journey",
      unlocked: (stats?.total_scans ?? 0) >= 1,
    },
    {
      id: "first-voice",
      icon: <Mic className="h-5 w-5" />,
      title: "First Voice Note",
      description: "Captured field observations",
      unlocked: (stats?.total_voice_notes ?? 0) >= 1,
    },
    {
      id: "field-explorer",
      icon: <Compass className="h-5 w-5" />,
      title: "Field Explorer",
      description: "Scanned 5+ specimens",
      unlocked: (stats?.total_scans ?? 0) >= 5,
    },
    {
      id: "note-taker",
      icon: <FileText className="h-5 w-5" />,
      title: "Dedicated Note Taker",
      description: "Created 3+ field notes",
      unlocked: (stats?.total_field_notes ?? 0) >= 3,
    },
    {
      id: "collector",
      icon: <Bookmark className="h-5 w-5" />,
      title: "Rock Collector",
      description: "Bookmarked 5+ specimens",
      unlocked: (stats?.total_bookmarks ?? 0) >= 5,
    },
  ];

  const getMotivationalText = (count: number, type: string): string => {
    if (count === 0) {
      switch (type) {
        case 'scans': return "Start your first scan!";
        case 'field_notes': return "Document your discoveries";
        case 'voice_notes': return "Record field observations";
        case 'bookmarks': return "Save specimens you love";
        default: return "Get started!";
      }
    }
    if (count < 5) return "Keep going!";
    if (count < 10) return "Great progress!";
    return "Excellent work!";
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="space-y-6 max-w-2xl mx-auto pb-20">
          {/* Hero skeleton */}
          <div className="rounded-2xl p-6 bg-gradient-to-br from-[hsl(var(--geo-brown))] to-[hsl(var(--geo-green))]">
            <div className="flex items-center gap-4">
              <Skeleton className="h-20 w-20 rounded-full bg-white/20" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-32 bg-white/20" />
                <Skeleton className="h-5 w-20 bg-white/20" />
              </div>
            </div>
          </div>
          
          {/* Stats skeleton */}
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6 max-w-2xl mx-auto pb-20">
        
        {/* Profile Hero Section */}
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[hsl(24,69%,31%)] to-[hsl(124,48%,33%)] p-6 shadow-lg">
          {/* Edit button */}
          <div className="absolute top-4 right-4">
            {!isEditing ? (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleEditClick}
                className="bg-white/10 hover:bg-white/20 text-white rounded-full"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleCancelEdit} 
                  disabled={saving}
                  className="bg-white/10 hover:bg-white/20 text-white rounded-full"
                >
                  <X className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleSaveProfile} 
                  disabled={saving}
                  className="bg-white/20 hover:bg-white/30 text-white rounded-full"
                >
                  <Check className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
              <Avatar className="h-20 w-20 ring-4 ring-white/30 shadow-xl">
                {profile?.avatar_url && (
                  <AvatarImage src={profile.avatar_url} alt={fullName} />
                )}
                <AvatarFallback className="text-2xl bg-white/20 text-white font-bold">
                  {fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="h-6 w-6 text-white" />
              </div>
              {uploading && (
                <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center">
                  <RefreshCw className="h-5 w-5 text-white animate-spin" />
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleAvatarChange}
              className="hidden"
            />
            
            {/* User Info */}
            <div className="flex-1">
              {!isEditing ? (
                <>
                  <h1 className="text-2xl font-bold text-white">{fullName}</h1>
                  <span className="inline-block mt-1.5 px-3 py-1 text-xs font-medium text-white bg-white/20 rounded-full capitalize">
                    {role}
                  </span>
                  <p className="text-white/80 text-sm mt-2">
                    Exploring Earth, One Specimen at a Time 🌍
                  </p>
                </>
              ) : (
                <div className="space-y-2">
                  <Input
                    value={editForm.full_name}
                    onChange={(e) => setEditForm(prev => ({ ...prev, full_name: e.target.value }))}
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                    placeholder="Your name"
                    maxLength={100}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Profile Details - Edit Mode */}
        {isEditing && (
          <Card className="border-0 shadow-md">
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="institute">Institute / Organization</Label>
                <Input
                  id="institute"
                  value={editForm.institute}
                  onChange={(e) => setEditForm(prev => ({ ...prev, institute: e.target.value }))}
                  placeholder="Your university or organization"
                  maxLength={200}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={editForm.bio}
                  onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Tell us about your geological interests..."
                  rows={3}
                  maxLength={500}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Profile Details - View Mode */}
        {!isEditing && (
          <div className="grid grid-cols-1 gap-3">
            {/* Email */}
            <div className="flex items-center gap-4 p-4 bg-card rounded-xl shadow-sm border border-border/50 hover:shadow-md transition-shadow">
              <div className="p-2.5 rounded-lg bg-[hsl(var(--geo-cream))]">
                <Mail className="h-5 w-5 text-[hsl(var(--geo-brown))]" />
              </div>
              <span className="text-sm text-foreground">{user?.email}</span>
            </div>
            
            {/* Role */}
            <div className="flex items-center gap-4 p-4 bg-card rounded-xl shadow-sm border border-border/50 hover:shadow-md transition-shadow">
              <div className="p-2.5 rounded-lg bg-[hsl(var(--geo-cream))]">
                <User className="h-5 w-5 text-[hsl(var(--geo-brown))]" />
              </div>
              <span className="text-sm text-foreground capitalize">{role}</span>
            </div>
            
            {/* Institute */}
            {profile?.institute && (
              <div className="flex items-center gap-4 p-4 bg-card rounded-xl shadow-sm border border-border/50 hover:shadow-md transition-shadow">
                <div className="p-2.5 rounded-lg bg-[hsl(var(--geo-cream))]">
                  <Building2 className="h-5 w-5 text-[hsl(var(--geo-brown))]" />
                </div>
                <span className="text-sm text-foreground">{profile.institute}</span>
              </div>
            )}
            
            {/* Focus Area / Bio */}
            {profile?.bio && (
              <div className="flex items-start gap-4 p-4 bg-card rounded-xl shadow-sm border border-border/50 hover:shadow-md transition-shadow">
                <div className="p-2.5 rounded-lg bg-[hsl(var(--geo-cream))]">
                  <Mountain className="h-5 w-5 text-[hsl(var(--geo-brown))]" />
                </div>
                <p className="text-sm text-muted-foreground">{profile.bio}</p>
              </div>
            )}
          </div>
        )}

        {/* Geo Progress Dashboard */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Your Geo Progress</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRefreshStats}
              disabled={refreshingStats}
              className="h-8 w-8"
            >
              <RefreshCw className={`h-4 w-4 ${refreshingStats ? "animate-spin" : ""}`} />
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {/* Scanned Specimens */}
            <div className="p-4 bg-card rounded-xl shadow-sm border border-border/50 hover:shadow-md transition-all hover:-translate-y-0.5">
              <div className="flex items-start justify-between">
                <div className="p-2 rounded-lg bg-[hsl(36,90%,94%)]">
                  <Scan className="h-5 w-5 text-[hsl(var(--geo-amber))]" />
                </div>
              </div>
              <p className="text-3xl font-bold text-foreground mt-3">{stats?.total_scans ?? 0}</p>
              <p className="text-sm text-muted-foreground">Scanned Specimens</p>
              <p className="text-xs text-[hsl(var(--geo-amber))] mt-1">
                {getMotivationalText(stats?.total_scans ?? 0, 'scans')}
              </p>
            </div>
            
            {/* Field Notes */}
            <div className="p-4 bg-card rounded-xl shadow-sm border border-border/50 hover:shadow-md transition-all hover:-translate-y-0.5">
              <div className="flex items-start justify-between">
                <div className="p-2 rounded-lg bg-[hsl(36,90%,94%)]">
                  <FileText className="h-5 w-5 text-[hsl(var(--geo-amber))]" />
                </div>
              </div>
              <p className="text-3xl font-bold text-foreground mt-3">{stats?.total_field_notes ?? 0}</p>
              <p className="text-sm text-muted-foreground">Field Notes</p>
              <p className="text-xs text-[hsl(var(--geo-amber))] mt-1">
                {getMotivationalText(stats?.total_field_notes ?? 0, 'field_notes')}
              </p>
            </div>
            
            {/* Voice Notes */}
            <div className="p-4 bg-card rounded-xl shadow-sm border border-border/50 hover:shadow-md transition-all hover:-translate-y-0.5">
              <div className="flex items-start justify-between">
                <div className="p-2 rounded-lg bg-[hsl(36,90%,94%)]">
                  <Mic className="h-5 w-5 text-[hsl(var(--geo-amber))]" />
                </div>
              </div>
              <p className="text-3xl font-bold text-foreground mt-3">{stats?.total_voice_notes ?? 0}</p>
              <p className="text-sm text-muted-foreground">Voice Notes</p>
              <p className="text-xs text-[hsl(var(--geo-amber))] mt-1">
                {getMotivationalText(stats?.total_voice_notes ?? 0, 'voice_notes')}
              </p>
            </div>
            
            {/* Bookmarks */}
            <div className="p-4 bg-card rounded-xl shadow-sm border border-border/50 hover:shadow-md transition-all hover:-translate-y-0.5">
              <div className="flex items-start justify-between">
                <div className="p-2 rounded-lg bg-[hsl(36,90%,94%)]">
                  <Bookmark className="h-5 w-5 text-[hsl(var(--geo-amber))]" />
                </div>
              </div>
              <p className="text-3xl font-bold text-foreground mt-3">{stats?.total_bookmarks ?? 0}</p>
              <p className="text-sm text-muted-foreground">Bookmarks</p>
              <p className="text-xs text-[hsl(var(--geo-amber))] mt-1">
                {getMotivationalText(stats?.total_bookmarks ?? 0, 'bookmarks')}
              </p>
            </div>
          </div>
        </div>

        {/* Geological Journey / Achievements */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Your Geological Journey</h2>
          
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`flex-shrink-0 w-40 p-4 rounded-xl border transition-all ${
                  achievement.unlocked
                    ? "bg-[hsl(30,100%,97%)] border-[hsl(var(--geo-amber))]/30 shadow-sm"
                    : "bg-muted/50 border-border/50 opacity-60"
                }`}
              >
                <div className={`p-2 rounded-lg inline-block ${
                  achievement.unlocked 
                    ? "bg-[hsl(36,90%,90%)] text-[hsl(var(--geo-amber))]" 
                    : "bg-muted text-muted-foreground"
                }`}>
                  {achievement.icon}
                </div>
                <h3 className="font-medium text-sm mt-3 text-foreground">{achievement.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">{achievement.description}</p>
                {achievement.unlocked && (
                  <div className="flex items-center gap-1 mt-2">
                    <Award className="h-3 w-3 text-[hsl(var(--geo-amber))]" />
                    <span className="text-xs text-[hsl(var(--geo-amber))] font-medium">Unlocked</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Settings & Account Actions */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Account</h2>
          
          <div className="space-y-2">
            <Link to="/settings">
              <div className="flex items-center justify-between p-4 bg-card rounded-xl shadow-sm border border-border/50 hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-muted">
                    <Settings className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <span className="text-sm font-medium text-foreground">Settings</span>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </Link>
            
            <Link to="/settings">
              <div className="flex items-center justify-between p-4 bg-card rounded-xl shadow-sm border border-border/50 hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-muted">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <span className="text-sm font-medium text-foreground">Notification Preferences</span>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </Link>
            
            <Link to="/settings">
              <div className="flex items-center justify-between p-4 bg-card rounded-xl shadow-sm border border-border/50 hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-muted">
                    <Shield className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <span className="text-sm font-medium text-foreground">Privacy & Security</span>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </Link>
          </div>
        </div>

        {/* Sign Out Button */}
        <Button
          variant="ghost"
          onClick={handleSignOut}
          className="w-full justify-start bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 border-0 rounded-xl py-6 dark:bg-red-950/30 dark:hover:bg-red-950/50 dark:text-red-400"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Sign Out
        </Button>
      </div>
    </AppLayout>
  );
}
