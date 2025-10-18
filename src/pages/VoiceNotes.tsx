import { AppLayout } from "@/components/layout/AppLayout";

export default function VoiceNotes() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Voice Notes</h1>
        <p className="text-muted-foreground">Record and transcribe field observations</p>
      </div>
    </AppLayout>
  );
}
