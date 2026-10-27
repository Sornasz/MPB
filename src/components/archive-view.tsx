"use client";

import { AppShell, PageHeader } from "@/components/app-shell";
import { EntryRow } from "@/components/entry-row";
import {
  EmptyState,
  FilterSelect,
  MonthSeparator,
  SearchField,
} from "@/components/ui";
import { formatMonthYear, monthKey, yearKey } from "@/lib/dates";
import { allTags } from "@/lib/repository";
import { useMpb } from "@/lib/store";
import { ENTRY_CATEGORIES, type Entry } from "@/lib/types";
import { useMemo, useState } from "react";

function groupByYearMonth(entries: Entry[]) {
  const years: {
    year: string;
    months: { key: string; label: string; entries: Entry[] }[];
  }[] = [];

  for (const e of entries) {
    const y = yearKey(e.date);
    const mk = monthKey(e.date);
    let yearGroup = years.find((g) => g.year === y);
    if (!yearGroup) {
      yearGroup = { year: y, months: [] };
      years.push(yearGroup);
    }
    let monthGroup = yearGroup.months.find((m) => m.key === mk);
    if (!monthGroup) {
      monthGroup = {
        key: mk,
        label: formatMonthYear(e.date),
        entries: [],
      };
      yearGroup.months.push(monthGroup);
    }
    monthGroup.entries.push(e);
  }
  return years;
}

export function ArchiveView() {
  const { ready, entries, projects, search } = useMpb();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [tag, setTag] = useState("");
  const [projectId, setProjectId] = useState("");
  const [year, setYear] = useState("");

  const tags = useMemo(() => allTags(entries), [entries]);
  const years = useMemo(
    () => [...new Set(entries.map((e) => yearKey(e.date)))].sort().reverse(),
    [entries],
  );

  const filtered = useMemo(() => {
    let list = search({ query, category, tag, projectId });
    if (year) list = list.filter((e) => yearKey(e.date) === year);
    return list;
  }, [search, query, category, tag, projectId, year]);

  const grouped = useMemo(() => groupByYearMonth(filtered), [filtered]);

  return (
    <AppShell>
      <div className="flex flex-col gap-[var(--space-24)] px-[var(--space-16)] py-[var(--space-24)] sm:px-[var(--space-32)] sm:py-[var(--space-40)] lg:px-[var(--space-48)]">
        <PageHeader
          kicker="Vault"
          title="Archive"
          description="Browse by year and month. Search across everything you’ve written."
        />

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <SearchField
            className="flex-1"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            shortcut={null}
          />
          <div className="flex flex-wrap gap-3">
            <FilterSelect
              label="Year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </FilterSelect>
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

        {!ready ? (
          <p className="font-body text-[var(--text-secondary)]">Loading…</p>
        ) : filtered.length === 0 ? (
          <EmptyState
            title="Nothing in the archive"
            body="Entries you create will show up here, grouped by year and month."
          />
        ) : (
          grouped.map((yg) => (
            <section key={yg.year} className="flex flex-col">
              <h2 className="font-h1 pt-4 text-[var(--text-primary)]">
                {yg.year}
              </h2>
              {yg.months.map((m) => (
                <div key={m.key}>
                  <MonthSeparator
                    label={m.label}
                    count={`${m.entries.length} entr${m.entries.length === 1 ? "y" : "ies"}`}
                  />
                  {m.entries.map((e) => (
                    <EntryRow key={e.id} entry={e} />
                  ))}
                </div>
              ))}
            </section>
          ))
        )}
      </div>
    </AppShell>
  );
}
