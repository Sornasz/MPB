import { EntryEditor } from "@/components/entry-editor";
import { Suspense } from "react";

export default function NewEntryPage() {
  return (
    <Suspense
      fallback={
        <p className="p-8 font-body text-[var(--text-secondary)]">Loading…</p>
      }
    >
      <EntryEditor mode="create" />
    </Suspense>
  );
}
