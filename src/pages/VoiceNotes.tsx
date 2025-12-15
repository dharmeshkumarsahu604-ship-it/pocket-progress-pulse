import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { VoiceRecorder } from "@/components/voice/VoiceRecorder";
import { VoiceNoteCard } from "@/components/voice/VoiceNoteCard";
import { PermissionGate } from "@/components/shared/PermissionGate";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface VoiceNote {
  id: string;
  name: string;
  date: Date;
  duration: number;
  audioUrl: string;
  transcript?: string;
}

export default function VoiceNotes() {
  const { user } = useAuth();
  const [notes, setNotes] = useState<VoiceNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRecorder, setShowRecorder] = useState(false);

  useEffect(() => {
    if (user) {
      fetchNotes();
    } else {
      setNotes([]);
      setLoading(false);
    }
  }, [user]);

  const fetchNotes = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('voice_notes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mappedNotes: VoiceNote[] = (data || []).map(note => ({
        id: note.id,
        name: note.title,
        date: new Date(note.created_at),
        duration: note.duration || 0,
        audioUrl: note.audio_url,
        transcript: note.transcription || undefined
      }));

      setNotes(mappedNotes);
    } catch (error) {
      console.error('Error fetching voice notes:', error);
      toast.error('Failed to load voice notes');
    } finally {
      setLoading(false);
    }
  };

  const handleRecordingComplete = async (audioBlob: Blob, duration: number) => {
    if (!user) {
      toast.error('Please sign in to save recordings');
      return;
    }

    try {
      // Upload audio to Supabase Storage
      const fileName = `${user.id}/${Date.now()}.webm`;
      const { error: uploadError } = await supabase.storage
        .from('voice-recordings')
        .upload(fileName, audioBlob, {
          contentType: 'audio/webm',
          upsert: false
        });

      if (uploadError) {
        // If bucket doesn't exist, save with blob URL temporarily
        console.error('Storage upload error:', uploadError);
        
        // Fall back to saving without storage (audio_url will be temporary)
        const tempUrl = URL.createObjectURL(audioBlob);
        const { error: insertError } = await supabase
          .from('voice_notes')
          .insert({
            user_id: user.id,
            title: `Recording ${new Date().toLocaleString()}`,
            audio_url: tempUrl,
            duration: Math.round(duration),
            transcription: "Transcription will be available after processing..."
          });

        if (insertError) throw insertError;
      } else {
        // Get public URL
        const { data: urlData } = supabase.storage
          .from('voice-recordings')
          .getPublicUrl(fileName);

        const { error: insertError } = await supabase
          .from('voice_notes')
          .insert({
            user_id: user.id,
            title: `Recording ${new Date().toLocaleString()}`,
            audio_url: urlData.publicUrl,
            duration: Math.round(duration),
            transcription: "Transcription will be available after processing..."
          });

        if (insertError) throw insertError;
      }

      await fetchNotes();
      setShowRecorder(false);
      toast.success("Recording saved!");
    } catch (error) {
      console.error('Error saving voice note:', error);
      toast.error('Failed to save recording');
    }
  };

  const handleDelete = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('voice_notes')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      
      setNotes((prev) => prev.filter((note) => note.id !== id));
      toast.success("Recording deleted");
    } catch (error) {
      console.error('Error deleting voice note:', error);
      toast.error('Failed to delete recording');
    }
  };

  if (!user) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <h2 className="text-xl font-semibold mb-2">Sign in Required</h2>
          <p className="text-muted-foreground">Please sign in to access your voice notes.</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PermissionGate 
        permissions={['microphone', 'storage']}
        title="Voice Notes Permissions"
        description="Voice Notes needs access to:"
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Voice Notes</h1>
              <p className="text-muted-foreground">
                {notes.length} recording{notes.length !== 1 ? "s" : ""}
              </p>
            </div>
            {!showRecorder && (
              <Button onClick={() => setShowRecorder(true)}>
                <Plus className="mr-2 h-4 w-4" />
                New Recording
              </Button>
            )}
          </div>

          {showRecorder && (
            <div className="space-y-4">
              <VoiceRecorder onRecordingComplete={handleRecordingComplete} />
              <Button
                variant="outline"
                onClick={() => setShowRecorder(false)}
                className="w-full"
              >
                Cancel
              </Button>
            </div>
          )}

          {!showRecorder && loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}

          {!showRecorder && !loading && notes.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No recordings yet</p>
              <Button onClick={() => setShowRecorder(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create First Recording
              </Button>
            </div>
          )}

          {!showRecorder && !loading && notes.length > 0 && (
            <div className="space-y-3">
              {notes.map((note) => (
                <VoiceNoteCard
                  key={note.id}
                  {...note}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </PermissionGate>
    </AppLayout>
  );
}
