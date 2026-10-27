"use client";

import { AppShell } from "@/components/app-shell";
import {
  Button,
  CategoryLabel,
  Modal,
  StatusPill,
  TagChip,
} from "@/components/ui";
import {
  formatEntryNumber,
  formatLongDate,
  formatWeekdayLong,
} from "@/lib/dates";
import { useMpb } from "@/lib/store";
import {
  ArrowLeft,
  Download,
  ExternalLink,
  Link2,
  Paperclip,
  Pencil,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function EntryDetail({ id }: { id: string }) {
  const router = useRouter();
  const { ready, getEntry, getProject, neighbors, deleteEntry } = useMpb();
  const entry = getEntry(id);
  const [confirmOpen, setConfirmOpen] = useState(false);

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

  const project = entry.projectIds[0]
    ? getProject(entry.projectIds[0])
    : undefined;
  const { prev, next } = neighbors(entry.id);

  return (
    <AppShell>
      <div className="mx-auto flex w-full max-w-[var(--size-reading)] flex-col gap-[var(--space-24)] px-[var(--space-16)] py-[var(--space-24)] sm:px-[var(--space-32)] sm:py-[var(--space-40)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono-caps text-[var(--text-secondary)] no-underline hover:text-[var(--text-primary)]"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Journal
          </Link>
          <div className="flex gap-2">
            <Link href={`/entries/${entry.id}/edit`}>
              <Button variant="secondary">
                <Pencil className="size-4" aria-hidden />
                Edit
              </Button>
            </Link>
            <Button
              variant="ghost"
              onClick={() => setConfirmOpen(true)}
              aria-label="Delete entry"
            >
              <Trash2 className="size-4" aria-hidden />
              Delete
            </Button>
          </div>
        </div>

        <header className="flex flex-col gap-[var(--space-12)]">
          <div className="flex flex-wrap items-center gap-[var(--space-8)]">
            <CategoryLabel category={entry.type} />
            <span className="font-mono-caps text-[var(--text-secondary)]">
              {formatEntryNumber(entry.number)} · {formatWeekdayLong(entry.date)}
            </span>
          </div>
          <h1 className="font-display text-[var(--text-primary)]">{entry.title}</h1>
        </header>

        <div className="prose-entry">
          {entry.content.split(/\n\n+/).map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        <div className="flex flex-col gap-[var(--space-20)] border-t border-[var(--border-default)] pt-[var(--space-24)]">
          {entry.tags.length > 0 ? (
            <div className="flex flex-col gap-2">
              <p className="font-mono-caps text-[var(--text-secondary)]">Tags</p>
              <div className="flex flex-wrap gap-2">
                {entry.tags.map((t) => (
                  <TagChip key={t} label={t} />
                ))}
              </div>
            </div>
          ) : null}

          {project ? (
            <div className="flex flex-col gap-2">
              <p className="font-mono-caps text-[var(--text-secondary)]">
                Project
              </p>
              <div className="flex items-center gap-3">
                <Link
                  href={`/projects/${project.id}`}
                  className="font-ui text-[var(--text-accent)] no-underline hover:underline"
                >
                  {project.name}
                </Link>
                <StatusPill status={project.status} />
              </div>
            </div>
          ) : null}

          {(entry.links.length > 0 || entry.attachments.length > 0) && (
            <div className="flex flex-col gap-2">
              <p className="font-mono-caps text-[var(--text-secondary)]">
                Links & attachments
              </p>
              <ul className="flex flex-col">
                {entry.links.map((l) => (
                  <li
                    key={l.id}
                    className="flex items-center gap-3 border-b border-[var(--border-default)] py-3"
                  >
                    <Link2 className="size-4 text-[var(--text-secondary)]" />
                    <a
                      href={l.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 font-mono-lg text-[var(--text-accent)]"
                    >
                      {l.label || l.url}
                    </a>
                    <ExternalLink className="size-4 text-[var(--text-secondary)]" />
                  </li>
                ))}
                {entry.attachments.map((a) => (
                  <li
                    key={a.id}
                    className="flex items-center gap-3 border-b border-[var(--border-default)] py-3"
                  >
                    <Paperclip className="size-4 text-[var(--text-secondary)]" />
                    <span className="flex-1 font-mono-lg text-[var(--text-primary)]">
                      {a.name}
                      {a.sizeLabel ? (
                        <span className="text-[var(--text-secondary)]">
                          {" "}
                          ({a.sizeLabel})
                        </span>
                      ) : null}
                    </span>
                    <Download className="size-4 text-[var(--text-secondary)]" aria-hidden />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <nav className="flex flex-col gap-4 border-t border-[var(--border-default)] pt-[var(--space-24)] sm:flex-row sm:justify-between">
          {prev ? (
            <Link
              href={`/entries/${prev.id}`}
              className="group flex flex-col gap-1 no-underline"
            >
              <span className="inline-flex items-center gap-2 font-mono-caps text-[var(--text-secondary)]">
                <ArrowLeft className="size-4" /> Previous
              </span>
              <span className="font-h2 text-[var(--text-primary)] group-hover:text-[var(--text-accent)]">
                {prev.title}
              </span>
              <span className="font-mono-meta text-[var(--text-secondary)]">
                {formatLongDate(prev.date)}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={`/entries/${next.id}`}
              className="group flex flex-col gap-1 text-right no-underline sm:items-end"
            >
              <span className="inline-flex items-center gap-2 font-mono-caps text-[var(--text-secondary)]">
                Next <ArrowLeft className="size-4 rotate-180" />
              </span>
              <span className="font-h2 text-[var(--text-primary)] group-hover:text-[var(--text-accent)]">
                {next.title}
              </span>
              <span className="font-mono-meta text-[var(--text-secondary)]">
                {formatLongDate(next.date)}
              </span>
            </Link>
          ) : null}
        </nav>
      </div>

      <Modal
        open={confirmOpen}
        title="Delete this entry?"
        onClose={() => setConfirmOpen(false)}
        actions={
          <>
            <Button variant="secondary" onClick={() => setConfirmOpen(false)}>
              Keep it
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                deleteEntry(entry.id);
                setConfirmOpen(false);
                router.push("/");
              }}
            >
              Delete permanently
            </Button>
          </>
        }
      >
        <p>
          “{entry.title}” will be removed from this device. This cannot be undone.
        </p>
      </Modal>
    </AppShell>
  );
}
