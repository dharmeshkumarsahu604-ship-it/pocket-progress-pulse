import { AppLayout } from "@/components/layout/AppLayout";

export default function Chat() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">AI Chat</h1>
        <p className="text-muted-foreground">Ask geological questions and get expert answers</p>
      </div>
    </AppLayout>
  );
}
