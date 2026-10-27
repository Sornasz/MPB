import { EntryDetail } from "@/components/entry-detail";
import { Suspense } from "react";

async function EntryPageBody({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EntryDetail id={id} />;
}

export default function EntryPage({
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
      <EntryPageBody params={params} />
    </Suspense>
  );
}
