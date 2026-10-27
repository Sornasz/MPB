"use client";

import { AppShell, PageHeader } from "@/components/app-shell";
import {
  Button,
  EmptyState,
  Modal,
  StatusPill,
} from "@/components/ui";
import { formatLongDate } from "@/lib/dates";
import { useMpb } from "@/lib/store";
import type { ProjectStatus } from "@/lib/types";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

export function ProjectsView() {
  const { ready, projects, entries, createProject } = useMpb();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<ProjectStatus>("active");

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const e of entries) {
      for (const pid of e.projectIds) {
        map.set(pid, (map.get(pid) ?? 0) + 1);
      }
    }
    return map;
  }, [entries]);

  function submit() {
    if (!name.trim()) return;
    const p = createProject({ name, description, status });
    setOpen(false);
    setName("");
    setDescription("");
    setStatus("active");
    window.location.href = `/projects/${p.id}`;
  }

  return (
    <AppShell>
      <div className="flex flex-col gap-[var(--space-24)] px-[var(--space-16)] py-[var(--space-24)] sm:px-[var(--space-32)] sm:py-[var(--space-40)] lg:px-[var(--space-48)]">
        <PageHeader
          kicker="Credits"
          title="Projects"
          description="Things you build over time — linked to the entries that moved them forward."
          actions={
            <Button onClick={() => setOpen(true)}>
              <Plus className="size-5" aria-hidden />
              New project
            </Button>
          }
        />

        {!ready ? (
          <p className="font-body text-[var(--text-secondary)]">Loading…</p>
        ) : projects.length === 0 ? (
          <EmptyState
            title="No projects yet"
            body="Create a project when an entry belongs to something larger than a single day."
            action={
              <Button onClick={() => setOpen(true)}>New project</Button>
            }
          />
        ) : (
          <ul className="flex flex-col">
            {projects.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/projects/${p.id}`}
                  className="flex flex-col gap-2 border-b border-[var(--border-default)] py-6 no-underline hover:bg-[var(--surface-paper)]/50 sm:flex-row sm:items-start sm:justify-between"
                >
                  <div className="flex min-w-0 flex-col gap-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="font-h2 text-[var(--text-primary)]">
                        {p.name}
                      </h2>
                      <StatusPill status={p.status} />
                    </div>
                    {p.description ? (
                      <p className="font-body max-w-[60ch] text-[var(--text-secondary)]">
                        {p.description}
                      </p>
                    ) : null}
                  </div>
                  <div className="shrink-0 font-mono-meta text-[var(--text-secondary)]">
                    Started {formatLongDate(p.startDate)} ·{" "}
                    {counts.get(p.id) ?? 0} entries
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Modal
        open={open}
        title="New project"
        onClose={() => setOpen(false)}
        actions={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submit} disabled={!name.trim()}>
              Create project
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-3">
          <label className="flex flex-col gap-1">
            <span className="font-caption text-[var(--text-secondary)]">Name</span>
            <input
              className="h-11 rounded-[var(--radius-md)] border border-[var(--border-strong)] bg-[var(--surface-paper)] px-3 font-body outline-none focus-visible:outline focus-visible:outline-[var(--size-focus-ring)] focus-visible:outline-[var(--border-focus)]"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="font-caption text-[var(--text-secondary)]">
              Description
            </span>
            <textarea
              className="min-h-20 rounded-[var(--radius-md)] border border-[var(--border-strong)] bg-[var(--surface-paper)] px-3 py-2 font-body outline-none focus-visible:outline focus-visible:outline-[var(--size-focus-ring)] focus-visible:outline-[var(--border-focus)]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="font-caption text-[var(--text-secondary)]">Status</span>
            <select
              className="h-11 rounded-[var(--radius-md)] border border-[var(--border-strong)] bg-[var(--surface-paper)] px-3 font-ui"
              value={status}
              onChange={(e) => setStatus(e.target.value as ProjectStatus)}
            >
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="completed">Completed</option>
            </select>
          </label>
        </div>
      </Modal>
    </AppShell>
  );
}
