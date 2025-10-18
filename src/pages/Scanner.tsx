import { AppLayout } from "@/components/layout/AppLayout";

export default function Scanner() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">AI Scanner</h1>
        <p className="text-muted-foreground">Identify rocks and minerals with AI</p>
      </div>
    </AppLayout>
  );
}
