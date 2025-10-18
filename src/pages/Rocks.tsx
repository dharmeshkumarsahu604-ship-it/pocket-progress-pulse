import { AppLayout } from "@/components/layout/AppLayout";

export default function Rocks() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Rock Database</h1>
        <p className="text-muted-foreground">Comprehensive collection of rock specimens</p>
      </div>
    </AppLayout>
  );
}
