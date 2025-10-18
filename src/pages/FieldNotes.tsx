import { AppLayout } from "@/components/layout/AppLayout";

export default function FieldNotes() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Field Notes</h1>
        <p className="text-muted-foreground">Document your geological observations</p>
      </div>
    </AppLayout>
  );
}
