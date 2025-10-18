import { AppLayout } from "@/components/layout/AppLayout";

export default function Profile() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>
    </AppLayout>
  );
}
