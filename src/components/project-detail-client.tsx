"use client";

import { AppShell } from "@/components/app-shell";
import { EntryRow } from "@/components/entry-row";
import { Button, StatusPill } from "@/components/ui";
import { formatLongDate } from "@/lib/dates";
import { useMpb } from "@/lib/store";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

export function ProjectDetailClient({ id }: { id: string }) {
  const { ready, getProject, entries } = useMpb();
  const project = getProject(id);
  const related = useMemo(
    () => entries.filter((e) => e.projectIds.includes(id)),
    [entries, id],
  );

  if (!ready) {
    return (
      <AppShell>
        <p className="p-8 font-body text-[var(--text-secondary)]">Loading…</p>
      </AppShell>
    );
  }

  if (!project) {
    return (
      <AppShell>
        <div className="p-8">
          <p className="font-h2">Project not found</p>
          <Link
            href="/projects"
            className="mt-4 inline-block text-[var(--text-accent)]"
          >
            Back to projects
          </Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="mx-auto flex w-full max-w-[var(--size-column)] flex-col gap-[var(--space-24)] px-[var(--space-16)] py-[var(--space-24)] sm:px-[var(--space-32)] sm:py-[var(--space-40)]">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 font-mono-caps text-[var(--text-secondary)] no-underline"
        >
          <ArrowLeft className="size-4" /> Projects
        </Link>

        <header className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-display text-[var(--text-primary)]">
              {project.name}
            </h1>
            <StatusPill status={project.status} />
          </div>
          {project.description ? (
            <p className="font-body-lg max-w-[60ch] text-[var(--text-secondary)]">
              {project.description}
            </p>
          ) : null}
          <p className="font-mono-meta text-[var(--text-secondary)]">
            Started {formatLongDate(project.startDate)} · {related.length}{" "}
            linked entries
          </p>
        </header>

        <section>
          <h2 className="font-h2 mb-2">Entries</h2>
          {related.length === 0 ? (
            <div className="flex flex-col gap-3 rounded-[var(--radius-md)] border border-dashed border-[var(--border-strong)] p-8">
              <p className="font-body text-[var(--text-secondary)]">
                No entries linked yet. Create one and pick this project.
              </p>
              <Link href="/entries/new">
                <Button>New entry</Button>
              </Link>
            </div>
          ) : (
            related.map((e) => <EntryRow key={e.id} entry={e} />)
          )}
        </section>
      </div>
    </AppShell>
  );
}
