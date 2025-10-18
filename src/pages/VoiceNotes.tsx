import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { VoiceRecorder } from "@/components/voice/VoiceRecorder";
import { VoiceNoteCard } from "@/components/voice/VoiceNoteCard";
import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Plus } from "lucide-react";
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
  const [notes, setNotes] = useLocalStorage<VoiceNote[]>("voice-notes", []);
  const [showRecorder, setShowRecorder] = useState(false);

  const handleRecordingComplete = (audioBlob: Blob, duration: number) => {
    const audioUrl = URL.createObjectURL(audioBlob);
    const newNote: VoiceNote = {
      id: Date.now().toString(),
      name: `Recording ${new Date().toLocaleString()}`,
      date: new Date(),
      duration,
      audioUrl,
      transcript: "Transcription will be available after processing...",
    };

    setNotes((prev) => [newNote, ...prev]);
    setShowRecorder(false);
    toast.success("Recording saved!");
  };

  const handleDelete = (id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
    toast.success("Recording deleted");
  };

  return (
    <AppLayout>
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

        {!showRecorder && notes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No recordings yet</p>
            <Button onClick={() => setShowRecorder(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create First Recording
            </Button>
          </div>
        )}

        {!showRecorder && notes.length > 0 && (
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
    </AppLayout>
  );
}
