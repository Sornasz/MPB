"use client";

import { AppShell, NewEntryButton, PageHeader } from "@/components/app-shell";
import { EntryRow } from "@/components/entry-row";
import {
  Button,
  CategoryLabel,
  EmptyState,
  FilterSelect,
  MonthSeparator,
  SearchField,
} from "@/components/ui";
import {
  distinctMonthCount,
  formatLongDate,
  formatMonthYear,
  formatWeekdayLong,
  monthKey,
} from "@/lib/dates";
import { allTags } from "@/lib/repository";
import { useMpb } from "@/lib/store";
import { ENTRY_CATEGORIES, type Entry } from "@/lib/types";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

function groupByMonth(entries: Entry[]) {
  const groups: { key: string; label: string; entries: Entry[] }[] = [];
  for (const e of entries) {
    const key = monthKey(e.date);
    const last = groups[groups.length - 1];
    if (last && last.key === key) last.entries.push(e);
    else
      groups.push({
        key,
        label: formatMonthYear(e.date),
        entries: [e],
      });
  }
  return groups;
}

export function JournalView() {
  const { ready, entries, projects, search } = useMpb();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [tag, setTag] = useState("");
  const [projectId, setProjectId] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const filtered = useMemo(
    () => search({ query, category, tag, projectId }),
    [search, query, category, tag, projectId],
  );

  const groups = useMemo(() => groupByMonth(filtered), [filtered]);
  const tags = useMemo(() => allTags(entries), [entries]);
  const months = distinctMonthCount(entries.map((e) => e.date));
  const latest = entries[0];
  const activeProjects = projects.filter((p) => p.status === "active").length;

  const categoryCounts = useMemo(() => {
    const map = Object.fromEntries(ENTRY_CATEGORIES.map((c) => [c, 0])) as Record<
      string,
      number
    >;
    for (const e of entries) if (e.type) map[e.type] += 1;
    return map;
  }, [entries]);

  const kicker = ready
    ? formatWeekdayLong(latest?.date ?? "2026-10-26")
    : "…";

  const description =
    entries.length === 0
      ? "Keep a record of your progress."
      : `${entries.length} entr${entries.length === 1 ? "y" : "ies"} across ${months} month${months === 1 ? "" : "s"}. Keep a record of your progress.`;

  return (
    <AppShell>
      <div className="flex flex-col gap-[var(--space-24)] px-[var(--space-16)] py-[var(--space-24)] sm:px-[var(--space-32)] sm:py-[var(--space-40)] lg:px-[var(--space-48)]">
        <PageHeader
          kicker={kicker}
          title="Journal"
          description={description}
          actions={<NewEntryButton />}
        />

        <div className="flex flex-col gap-[var(--space-12)] lg:flex-row lg:items-center">
          <SearchField
            ref={searchRef}
            className="w-full flex-1"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="flex flex-wrap gap-[var(--space-12)]">
            <FilterSelect
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {ENTRY_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </FilterSelect>
            <FilterSelect
              label="Tag"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
            >
              {tags.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </FilterSelect>
            <FilterSelect
              label="Project"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </FilterSelect>
          </div>
        </div>

        <div className="flex gap-[var(--space-64)] items-start">
          <div className="min-w-0 flex-1">
            {!ready ? (
              <p className="font-body text-[var(--text-secondary)]">Loading…</p>
            ) : entries.length === 0 ? (
              <EmptyState
                title="Your journal is empty"
                body="Write the first thing you built, learned, or finished. A sentence is enough."
                action={
                  <Link href="/entries/new">
                    <Button>New entry</Button>
                  </Link>
                }
              />
            ) : filtered.length === 0 ? (
              <EmptyState
                title="No matching entries"
                body="Try another search term or clear the filters."
                action={
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setQuery("");
                      setCategory("");
                      setTag("");
                      setProjectId("");
                    }}
                  >
                    Clear filters
                  </Button>
                }
              />
            ) : (
              groups.map((g) => (
                <section key={g.key}>
                  <MonthSeparator
                    label={g.label}
                    count={`${g.entries.length} entr${g.entries.length === 1 ? "y" : "ies"}`}
                  />
                  {g.entries.map((e) => (
                    <EntryRow key={e.id} entry={e} />
                  ))}
                </section>
              ))
            )}
          </div>

          <aside className="hidden w-[220px] shrink-0 flex-col gap-[var(--space-16)] xl:flex">
            <p className="font-mono-caps text-[var(--text-secondary)]">Side notes</p>
            <Stat label="Entries" value={String(entries.length)} />
            <Stat
              label="Latest"
              value={latest ? formatLongDate(latest.date) : "—"}
            />
            <Stat
              label="Projects"
              value={`${projects.length} · ${activeProjects} active`}
            />
            <Stat label="Tags" value={String(tags.length)} />
            <div className="h-px w-full bg-[var(--border-default)]" />
            <p className="font-mono-caps text-[var(--text-secondary)]">Index</p>
            {ENTRY_CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                className="flex w-full items-center gap-[var(--space-8)] text-left"
                onClick={() => setCategory(category === c ? "" : c)}
              >
                <CategoryLabel category={c} />
                <span className="min-w-px flex-1" />
                <span className="font-mono-meta text-[var(--text-secondary)]">
                  {categoryCounts[c]}
                </span>
              </button>
            ))}
          </aside>
        </div>

        <p className="font-body-sm text-[var(--text-secondary)]">
          Your entries stay on this device. No sync between devices or users.
        </p>
      </div>
    </AppShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-[var(--space-2)]">
      <p className="font-mono-caps text-[var(--text-secondary)]">{label}</p>
      <p className="font-body text-[var(--text-primary)]">{value}</p>
    </div>
  );
}
