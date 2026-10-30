import { Card } from "@/components/ui/Card";

export function StatCard({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <Card>
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-ink">{value}</p>
      {note && <p className="mt-1 text-xs text-subtle">{note}</p>}
    </Card>
  );
}
