import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { FieldNoteEditor } from "@/components/fieldnotes/FieldNoteEditor";
import { FieldNoteCard } from "@/components/fieldnotes/FieldNoteCard";
import { PermissionGate } from "@/components/shared/PermissionGate";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface FieldNote {
  id: string;
  title: string;
  content: string;
  date: Date;
  location?: { lat: number; lng: number; name: string };
  photos: string[];
}

export default function FieldNotes() {
  const { user } = useAuth();
  const [notes, setNotes] = useState<FieldNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editingNote, setEditingNote] = useState<FieldNote | null>(null);

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
        .from('field_notes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mappedNotes: FieldNote[] = (data || []).map(note => ({
        id: note.id,
        title: note.title,
        content: note.content,
        date: new Date(note.created_at),
        location: note.latitude && note.longitude ? {
          lat: Number(note.latitude),
          lng: Number(note.longitude),
          name: note.location_name || ''
        } : undefined,
        photos: note.photos || []
      }));

      setNotes(mappedNotes);
    } catch (error) {
      console.error('Error fetching field notes:', error);
      toast.error('Failed to load field notes');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (note: FieldNote) => {
    if (!user) {
      toast.error('Please sign in to save notes');
      return;
    }

    try {
      if (editingNote) {
        const { error } = await supabase
          .from('field_notes')
          .update({
            title: note.title,
            content: note.content,
            latitude: note.location?.lat || null,
            longitude: note.location?.lng || null,
            location_name: note.location?.name || null,
            photos: note.photos,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingNote.id)
          .eq('user_id', user.id);

        if (error) throw error;
        toast.success("Note updated");
      } else {
        const { error } = await supabase
          .from('field_notes')
          .insert({
            user_id: user.id,
            title: note.title,
            content: note.content,
            latitude: note.location?.lat || null,
            longitude: note.location?.lng || null,
            location_name: note.location?.name || null,
            photos: note.photos
          });

        if (error) throw error;
        toast.success("Note saved");
      }
      
      await fetchNotes();
      setShowEditor(false);
      setEditingNote(null);
    } catch (error) {
      console.error('Error saving field note:', error);
      toast.error('Failed to save note');
    }
  };

  const handleDelete = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('field_notes')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      
      setNotes((prev) => prev.filter((note) => note.id !== id));
      toast.success("Note deleted");
    } catch (error) {
      console.error('Error deleting field note:', error);
      toast.error('Failed to delete note');
    }
  };

  const handleEdit = (note: FieldNote) => {
    setEditingNote(note);
    setShowEditor(true);
  };

  const handleCancel = () => {
    setShowEditor(false);
    setEditingNote(null);
  };

  if (!user) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <h2 className="text-xl font-semibold mb-2">Sign in Required</h2>
          <p className="text-muted-foreground">Please sign in to access your field notes.</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PermissionGate 
        permissions={['geolocation', 'camera', 'storage']}
        title="Field Notes Permissions"
        description="Field Notes needs access to:"
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Field Notes</h1>
              <p className="text-muted-foreground">
                {notes.length} note{notes.length !== 1 ? "s" : ""}
              </p>
            </div>
            {!showEditor && (
              <Button onClick={() => setShowEditor(true)}>
                <Plus className="mr-2 h-4 w-4" />
                New Note
              </Button>
            )}
          </div>

          {showEditor && (
            <FieldNoteEditor 
              onSave={handleSave} 
              onCancel={handleCancel}
              initialNote={editingNote || undefined}
            />
          )}

          {!showEditor && loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}

          {!showEditor && !loading && notes.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No field notes yet</p>
              <Button onClick={() => setShowEditor(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create First Note
              </Button>
            </div>
          )}

          {!showEditor && !loading && notes.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2">
              {notes.map((note) => (
                <FieldNoteCard
                  key={note.id}
                  note={note}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                />
              ))}
            </div>
          )}
        </div>
      </PermissionGate>
    </AppLayout>
  );
}
