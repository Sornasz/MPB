import { EditEntryClient } from "@/components/edit-entry-client";
import { Suspense } from "react";

async function EditEntryBody({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EditEntryClient id={id} />;
}

export default function EditEntryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <p className="p-8 font-body text-[var(--text-secondary)]">Loading…</p>
      }
    >
      <EditEntryBody params={params} />
    </Suspense>
  );
}
