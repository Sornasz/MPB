"use client";

import { AppShell } from "@/components/app-shell";
import { Button, TagChip } from "@/components/ui";
import { formatEntryNumber, formatLongDate, todayIso } from "@/lib/dates";
import { useMpb } from "@/lib/store";
import { ENTRY_CATEGORIES, type Entry, type EntryCategory } from "@/lib/types";
import { ArrowLeft, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type Props = {
  mode: "create" | "edit";
  entry?: Entry;
};

export function EntryEditor({ mode, entry }: Props) {
  const router = useRouter();
  const { createEntry, updateEntry, store, projects } = useMpb();
  const nextNumber = mode === "create" ? store.nextEntryNumber : entry?.number ?? 0;

  const [title, setTitle] = useState(entry?.title ?? "");
  const [content, setContent] = useState(entry?.content ?? "");
  const [date, setDate] = useState(entry?.date ? entry.date.slice(0, 16) : "");
  const [type, setType] = useState<EntryCategory | "">(entry?.type ?? "");
  const [projectId, setProjectId] = useState(entry?.projectIds[0] ?? "");
  const [tags, setTags] = useState<string[]>(entry?.tags ?? []);
  const [tagDraft, setTagDraft] = useState("");
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState("");

  const canSave = title.trim().length > 0 || content.trim().length > 0;

  useEffect(() => {
    if (!date) {
      const now = todayIso().slice(0, 16);
      setDate(now);
    }
  }, [date]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        void save();
      }
      if (e.key === "Escape") {
        router.push(mode === "edit" && entry ? `/entries/${entry.id}` : "/");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, content, date, type, projectId, tags, dirty]);

  const statusLabel = useMemo(() => {
    if (!dirty) return mode === "edit" ? "Saved on this device" : "Draft — not saved yet";
    return "Unsaved changes";
  }, [dirty, mode]);

  function addTag() {
    const t = tagDraft.trim().toLowerCase();
    if (!t || tags.includes(t)) {
      setTagDraft("");
      return;
    }
    setTags([...tags, t]);
    setTagDraft("");
    setDirty(true);
  }

  function save() {
    if (!canSave) {
      setError("Write a title or a few words before saving.");
      return;
    }
    setError("");
    const iso = date.length === 16 ? `${date}:00` : date;
    const payload = {
      title: title.trim() || "Untitled",
      content,
      date: iso,
      type: type || undefined,
      tags,
      projectIds: projectId ? [projectId] : [],
    };

    if (mode === "create") {
      const created = createEntry(payload);
      router.push(`/entries/${created.id}`);
    } else if (entry) {
      updateEntry(entry.id, payload);
      setDirty(false);
      router.push(`/entries/${entry.id}`);
    }
  }

  return (
    <AppShell hideFab>
      <div className="mx-auto flex w-full max-w-[var(--size-reading)] flex-col gap-[var(--space-24)] px-[var(--space-16)] py-[var(--space-24)] sm:px-[var(--space-32)] sm:py-[var(--space-40)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href={mode === "edit" && entry ? `/entries/${entry.id}` : "/"}
            className="inline-flex items-center gap-2 font-mono-caps text-[var(--text-secondary)] no-underline hover:text-[var(--text-primary)]"
          >
            <ArrowLeft className="size-4" aria-hidden />
            {mode === "create"
              ? `New entry · ${formatEntryNumber(nextNumber)}`
              : `Edit · ${formatEntryNumber(nextNumber)}`}
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono-meta text-[var(--text-secondary)]">
              ● {statusLabel}
            </span>
            <Button variant="secondary" type="button" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="button" onClick={save} disabled={!canSave}>
              Save entry
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-[var(--space-12)]">
          <label className="inline-flex h-[var(--size-nav-item)] items-center gap-2 rounded-[var(--radius-md)] border border-[var(--border-strong)] bg-[var(--surface-paper)] px-3 font-mono-meta text-[var(--text-secondary)]">
            <span className="sr-only">Date</span>
            <input
              type="datetime-local"
              className="bg-transparent font-mono-meta text-[var(--text-primary)] outline-none"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                setDirty(true);
              }}
            />
          </label>
          <div className="relative">
            <select
              className="appearance-none h-[var(--size-nav-item)] rounded-[var(--radius-md)] border border-[var(--border-strong)] bg-[var(--surface-paper)] pl-3 pr-9 font-ui"
              value={type}
              onChange={(e) => {
                setType(e.target.value as EntryCategory | "");
                setDirty(true);
              }}
            >
              <option value="">Category</option>
              {ENTRY_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[var(--text-secondary)]" />
          </div>
          <div className="relative">
            <select
              className="appearance-none h-[var(--size-nav-item)] rounded-[var(--radius-md)] border border-[var(--border-strong)] bg-[var(--surface-paper)] pl-3 pr-9 font-ui"
              value={projectId}
              onChange={(e) => {
                setProjectId(e.target.value);
                setDirty(true);
              }}
            >
              <option value="">Project</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[var(--text-secondary)]" />
          </div>
          <span className="font-caption text-[var(--text-tertiary)]">Optional</span>
        </div>

        <div className="flex flex-col gap-[var(--space-16)]">
          <input
            className="w-full border-0 bg-transparent font-display text-[var(--text-primary)] outline-none placeholder:text-[var(--text-disabled)]"
            placeholder="Give it a title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setDirty(true);
              setError("");
            }}
            aria-label="Title"
          />
          <div className="h-px w-full bg-[var(--border-default)]" />
          <textarea
            className="min-h-[280px] w-full resize-y border-0 bg-transparent font-body-lg text-[var(--text-primary)] outline-none placeholder:text-[var(--text-disabled)]"
            placeholder="What did you build, learn or finish today? A sentence is enough. Markdown works here."
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              setDirty(true);
              setError("");
            }}
            aria-label="Content"
          />
        </div>

        {error ? (
          <p className="font-body-sm text-[var(--text-danger)]" role="alert">
            {error}
          </p>
        ) : null}

        <div className="flex flex-col gap-[var(--space-12)]">
          <p className="font-mono-caps text-[var(--text-secondary)]">Tags</p>
          <div className="flex flex-wrap items-center gap-2">
            {tags.map((t) => (
              <TagChip
                key={t}
                label={t}
                removable
                onRemove={() => {
                  setTags(tags.filter((x) => x !== t));
                  setDirty(true);
                }}
              />
            ))}
            <form
              className="inline-flex items-center gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                addTag();
              }}
            >
              <input
                className="h-8 rounded-[var(--radius-sm)] border border-[var(--border-strong)] bg-[var(--surface-paper)] px-3 font-mono-meta outline-none focus-visible:outline focus-visible:outline-[var(--size-focus-ring)] focus-visible:outline-[var(--border-focus)]"
                placeholder="+ Add tag"
                value={tagDraft}
                onChange={(e) => setTagDraft(e.target.value)}
                aria-label="Add tag"
              />
            </form>
          </div>
          <p className="font-mono-meta text-[var(--text-secondary)]">
            Markdown supported · ⌘S saves · Esc closes
            {date ? ` · ${formatLongDate(date)}` : ""}
          </p>
        </div>
      </div>
    </AppShell>
  );
}
