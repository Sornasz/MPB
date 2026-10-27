import { CategoryLabel, TagChip } from "@/components/ui";
import { formatDayMonth, formatEntryNumber } from "@/lib/dates";
import { excerptFromContent } from "@/lib/repository";
import type { Entry } from "@/lib/types";
import { Link2, Paperclip } from "lucide-react";
import Link from "next/link";

export function EntryRow({ entry }: { entry: Entry }) {
  const excerpt = excerptFromContent(entry.content);

  return (
    <Link
      href={`/entries/${entry.id}`}
      className="group flex w-full flex-col no-underline focus-visible:bg-[var(--surface-paper)]"
    >
      <article className="flex w-full gap-[var(--space-16)] px-[var(--space-8)] py-[var(--space-24)] sm:gap-[var(--space-32)] sm:px-[var(--space-16)]">
        <div className="hidden w-[96px] shrink-0 flex-col gap-[var(--space-4)] sm:flex">
          <span className="font-mono-caps text-[var(--text-secondary)]">
            {formatDayMonth(entry.date)}
          </span>
          <span className="font-mono-meta text-[var(--text-secondary)]">
            {formatEntryNumber(entry.number)}
          </span>
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-[var(--space-8)]">
          <div className="flex flex-wrap items-center gap-x-[var(--space-12)] gap-y-[var(--space-4)]">
            <CategoryLabel category={entry.type} />
            <span className="font-mono-caps text-[var(--text-secondary)] sm:hidden">
              {formatDayMonth(entry.date)} · {formatEntryNumber(entry.number)}
            </span>
          </div>
          <h3 className="font-h2 text-[var(--text-primary)] group-hover:text-[var(--text-accent-strong)]">
            {entry.title}
          </h3>
          {excerpt ? (
            <p className="font-body text-[var(--text-secondary)]">{excerpt}</p>
          ) : null}
          <div className="flex w-full flex-wrap items-center gap-[var(--space-16)]">
            {entry.tags.length > 0 ? (
              <div className="flex flex-wrap gap-[var(--space-8)]">
                {entry.tags.map((t) => (
                  <TagChip key={t} label={t} />
                ))}
              </div>
            ) : null}
            <div className="ml-auto flex items-center gap-[var(--space-12)]">
              {entry.links.length > 0 ? (
                <span className="inline-flex items-center gap-1 font-mono-meta text-[var(--text-secondary)]">
                  <Link2 className="size-4" aria-hidden />
                  {entry.links.length} link{entry.links.length === 1 ? "" : "s"}
                </span>
              ) : null}
              {entry.attachments.length > 0 ? (
                <span className="inline-flex items-center gap-1 font-mono-meta text-[var(--text-secondary)]">
                  <Paperclip className="size-4" aria-hidden />
                  {entry.attachments.length} file
                  {entry.attachments.length === 1 ? "" : "s"}
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </article>
      <div className="h-px w-full bg-[var(--border-default)]" />
    </Link>
  );
}
