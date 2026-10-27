"use client";

import { AppShell, PageHeader } from "@/components/app-shell";
import { EntryRow } from "@/components/entry-row";
import { EmptyState, TagChip } from "@/components/ui";
import { allTags } from "@/lib/repository";
import { useMpb } from "@/lib/store";
import { useMemo, useState } from "react";

export default function TagsPage() {
  const { ready, entries } = useMpb();
  const tags = useMemo(() => allTags(entries), [entries]);
  const [selected, setSelected] = useState<string | null>(null);

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const e of entries) {
      for (const t of e.tags) map.set(t, (map.get(t) ?? 0) + 1);
    }
    return map;
  }, [entries]);

  const filtered = useMemo(
    () =>
      selected
        ? entries.filter((e) => e.tags.includes(selected))
        : [],
    [entries, selected],
  );

  return (
    <AppShell>
      <div className="flex flex-col gap-[var(--space-24)] px-[var(--space-16)] py-[var(--space-24)] sm:px-[var(--space-32)] sm:py-[var(--space-40)] lg:px-[var(--space-48)]">
        <PageHeader
          kicker="Index"
          title="Tags"
          description="Browse entries by the labels you’ve attached over time."
        />

        {!ready ? (
          <p className="font-body text-[var(--text-secondary)]">Loading…</p>
        ) : tags.length === 0 ? (
          <EmptyState
            title="No tags yet"
            body="Add tags when you write an entry. They’ll collect here."
          />
        ) : (
          <>
            <div className="flex flex-wrap gap-2">
              {tags.map((t) => (
                <button
                  key={t}
                  type="button"
                  className="inline-flex items-center gap-2"
                  onClick={() => setSelected(selected === t ? null : t)}
                >
                  <TagChip label={t} selected={selected === t} size="lg" />
                  <span className="font-mono-meta text-[var(--text-secondary)]">
                    {counts.get(t) ?? 0}
                  </span>
                </button>
              ))}
            </div>

            {selected ? (
              <section>
                <h2 className="font-h2 mb-2">Tagged “{selected}”</h2>
                {filtered.map((e) => (
                  <EntryRow key={e.id} entry={e} />
                ))}
              </section>
            ) : (
              <p className="font-body text-[var(--text-secondary)]">
                Select a tag to see matching entries.
              </p>
            )}
          </>
        )}
      </div>
    </AppShell>
  );
}
