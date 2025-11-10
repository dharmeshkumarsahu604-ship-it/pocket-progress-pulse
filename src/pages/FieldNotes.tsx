import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { FieldNoteEditor, FieldNote } from "@/components/fieldnotes/FieldNoteEditor";
import { FieldNoteCard } from "@/components/fieldnotes/FieldNoteCard";
import { PermissionGate } from "@/components/shared/PermissionGate";
import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Plus } from "lucide-react";
import { toast } from "sonner";

export default function FieldNotes() {
  const [notes, setNotes] = useLocalStorage<FieldNote[]>("field-notes", []);
  const [showEditor, setShowEditor] = useState(false);
  const [editingNote, setEditingNote] = useState<FieldNote | null>(null);

  const handleSave = (note: FieldNote) => {
    if (editingNote) {
      setNotes((prev) =>
        prev.map((n) => (n.id === editingNote.id ? note : n))
      );
      toast.success("Note updated");
    } else {
      setNotes((prev) => [note, ...prev]);
      toast.success("Note saved");
    }
    setShowEditor(false);
    setEditingNote(null);
  };

  const handleDelete = (id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
    toast.success("Note deleted");
  };

  const handleEdit = (note: FieldNote) => {
    setEditingNote(note);
    setShowEditor(true);
  };

  const handleCancel = () => {
    setShowEditor(false);
    setEditingNote(null);
  };

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
          <FieldNoteEditor onSave={handleSave} onCancel={handleCancel} />
        )}

        {!showEditor && notes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No field notes yet</p>
            <Button onClick={() => setShowEditor(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create First Note
            </Button>
          </div>
        )}

        {!showEditor && notes.length > 0 && (
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
