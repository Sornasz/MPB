"use client";

import { AppShell } from "@/components/app-shell";
import { EntryEditor } from "@/components/entry-editor";
import { useMpb } from "@/lib/store";
import Link from "next/link";

export function EditEntryClient({ id }: { id: string }) {
  const { ready, getEntry } = useMpb();
  const entry = getEntry(id);

  if (!ready) {
    return (
      <AppShell>
        <p className="p-8 font-body text-[var(--text-secondary)]">Loading…</p>
      </AppShell>
    );
  }

  if (!entry) {
    return (
      <AppShell>
        <div className="p-8">
          <p className="font-h2">Entry not found</p>
          <Link href="/" className="mt-4 inline-block text-[var(--text-accent)]">
            Back to journal
          </Link>
        </div>
      </AppShell>
    );
  }

  return <EntryEditor mode="edit" entry={entry} />;
}
