import { AppLayout } from "@/components/layout/AppLayout";

export default function Minerals() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Mineral Database</h1>
        <p className="text-muted-foreground">Extensive collection of mineral specimens</p>
      </div>
    </AppLayout>
  );
}
