import { useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, Mail, LogOut, Settings, Building2, Camera, RefreshCw, Pencil, X, Check } from "lucide-react";
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

interface UserRole {
  role: string;
}

interface UserStats {
  total_scans: number;
  total_field_notes: number;
  total_voice_notes: number;
  total_bookmarks: number;
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

  // Use profile data first, then fall back to user metadata, then default
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
    
    // Validate with zod schema
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

    // Validate file
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

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) {
        secureLog.error("Upload error", uploadError);
        toast.error("Upload failed. Please try again.");
        return;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Update profile - insert if not exists
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

      // Update local state
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

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-screen">
          <p>Loading profile...</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6 max-w-2xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Profile Information</CardTitle>
            {!isEditing ? (
              <Button variant="ghost" size="icon" onClick={handleEditClick}>
                <Pencil className="h-4 w-4" />
              </Button>
            ) : (
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={handleCancelEdit} disabled={saving}>
                  <X className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleSaveProfile} disabled={saving}>
                  <Check className="h-4 w-4" />
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
                <Avatar className="h-20 w-20">
                  {profile?.avatar_url && (
                    <AvatarImage src={profile.avatar_url} alt={fullName} />
                  )}
                  <AvatarFallback className="text-2xl">
                    {fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="h-6 w-6 text-white" />
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleAvatarChange}
                className="hidden"
              />
              <div className="flex-1">
                {!isEditing ? (
                  <>
                    <h2 className="text-2xl font-bold">{fullName}</h2>
                    <Badge variant="secondary" className="mt-1 capitalize">
                      {role}
                    </Badge>
                    {uploading && (
                      <p className="text-sm text-muted-foreground mt-1">Uploading...</p>
                    )}
                  </>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      value={editForm.full_name}
                      onChange={(e) => setEditForm(prev => ({ ...prev, full_name: e.target.value }))}
                      maxLength={100}
                    />
                  </div>
                )}
              </div>
            </div>

            {isEditing ? (
              <div className="space-y-4">
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
                    placeholder="Tell us about yourself..."
                    rows={3}
                    maxLength={500}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm">{user?.email}</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm capitalize">{role}</span>
                </div>
                {profile?.institute && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm">{profile.institute}</span>
                  </div>
                )}
                {profile?.bio && (
                  <div className="p-3 rounded-lg bg-muted">
                    <p className="text-sm text-muted-foreground">{profile.bio}</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Statistics</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRefreshStats}
              disabled={refreshingStats}
            >
              <RefreshCw className={`h-4 w-4 ${refreshingStats ? "animate-spin" : ""}`} />
            </Button>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Scanned Specimens</p>
              <p className="text-2xl font-bold">{stats?.total_scans ?? 0}</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Field Notes</p>
              <p className="text-2xl font-bold">{stats?.total_field_notes ?? 0}</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Voice Notes</p>
              <p className="text-2xl font-bold">{stats?.total_voice_notes ?? 0}</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Bookmarks</p>
              <p className="text-2xl font-bold">{stats?.total_bookmarks ?? 0}</p>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-3">
          <Link to="/settings">
            <Button variant="outline" className="w-full justify-start">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </Link>
          <Button
            variant="destructive"
            onClick={handleSignOut}
            className="w-full justify-start"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
