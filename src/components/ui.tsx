"use client";

import { cn } from "@/lib/cn";
import type { EntryCategory, ProjectStatus } from "@/lib/types";
import {
  ChevronDown,
  type LucideIcon,
} from "lucide-react";
import {
  forwardRef,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
} from "react";

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary" | "ghost" | "danger";
    size?: "md" | "sm" | "icon";
  }
>(function Button(
  { className, variant = "primary", size = "md", children, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-[var(--space-8)] font-ui rounded-[var(--radius-md)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed",
        size === "md" && "h-[var(--size-touch)] px-[var(--space-20)]",
        size === "sm" && "h-[36px] px-[var(--space-12)]",
        size === "icon" && "size-[var(--size-touch)] px-0",
        variant === "primary" &&
          "bg-[var(--accent-default)] text-[var(--text-on-accent)] hover:bg-[var(--accent-hover)]",
        variant === "secondary" &&
          "bg-[var(--surface-paper)] text-[var(--text-primary)] border border-[var(--border-strong)] hover:bg-[var(--surface-secondary)]",
        variant === "ghost" &&
          "bg-transparent text-[var(--text-secondary)] hover:bg-[var(--surface-secondary)] hover:text-[var(--text-primary)]",
        variant === "danger" &&
          "bg-[var(--danger-default)] text-[var(--text-on-accent)] hover:bg-[var(--danger-hover)]",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
});

export const SearchField = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement> & { shortcut?: string | null }
>(function SearchField({ className, shortcut = "⌘K", ...props }, ref) {
  return (
    <label
      className={cn(
        "flex h-[var(--size-touch)] items-center gap-[var(--space-8)] rounded-[var(--radius-md)] border border-[var(--border-strong)] bg-[var(--surface-paper)] px-[var(--space-12)] focus-within:outline focus-within:outline-[var(--size-focus-ring)] focus-within:outline-[var(--border-focus)] focus-within:outline-offset-0",
        className,
      )}
    >
      <span className="sr-only">Search</span>
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        className="shrink-0 text-[var(--text-secondary)]"
        aria-hidden
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
      <input
        ref={ref}
        className="min-w-0 flex-1 bg-transparent font-body-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] outline-none"
        placeholder="Search entries"
        {...props}
      />
      {shortcut ? (
        <kbd className="hidden sm:inline-flex items-center rounded-[var(--radius-sm)] border border-[var(--border-strong)] bg-[var(--surface-secondary)] px-[var(--space-8)] py-[var(--space-2)] font-mono-meta text-[var(--text-secondary)]">
          {shortcut}
        </kbd>
      ) : null}
    </label>
  );
});

export function FilterSelect({
  label,
  className,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { label: string }) {
  return (
    <label className={cn("relative inline-flex shrink-0", className)}>
      <span className="sr-only">{label}</span>
      <select
        className="appearance-none h-[var(--size-nav-item)] min-h-[40px] rounded-[var(--radius-md)] border border-[var(--border-strong)] bg-[var(--surface-paper)] pl-[var(--space-12)] pr-[36px] font-ui text-[var(--text-primary)] focus-visible:outline focus-visible:outline-[var(--size-focus-ring)] focus-visible:outline-[var(--border-focus)]"
        {...props}
      >
        <option value="">{label}</option>
        {children}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[var(--text-secondary)]"
        aria-hidden
      />
    </label>
  );
}

const categoryStyles: Record<
  EntryCategory,
  { dot: string; text: string }
> = {
  Build: {
    dot: "bg-[var(--accent-default)]",
    text: "text-[var(--text-accent)]",
  },
  Learn: {
    dot: "bg-[var(--accent-hover)]",
    text: "text-[var(--text-accent)]",
  },
  Milestone: {
    dot: "bg-[var(--accent-alt-default)]",
    text: "text-[var(--accent-alt-text)]",
  },
  Experiment: {
    dot: "bg-[var(--text-secondary)]",
    text: "text-[var(--text-secondary)]",
  },
  Reflection: {
    dot: "bg-[var(--border-strong)]",
    text: "text-[var(--text-secondary)]",
  },
  Note: {
    dot: "bg-[var(--text-disabled)]",
    text: "text-[var(--text-secondary)]",
  },
};

export function CategoryLabel({
  category,
  className,
}: {
  category?: EntryCategory;
  className?: string;
}) {
  if (!category) return null;
  const style = categoryStyles[category];
  return (
    <span className={cn("inline-flex items-center gap-[var(--space-8)]", className)}>
      <span className={cn("size-2 rounded-full", style.dot)} aria-hidden />
      <span className={cn("font-mono-caps", style.text)}>{category}</span>
    </span>
  );
}

export function TagChip({
  label,
  selected,
  onClick,
  removable,
  onRemove,
  size = "md",
}: {
  label: string;
  selected?: boolean;
  onClick?: () => void;
  removable?: boolean;
  onRemove?: () => void;
  size?: "md" | "lg";
}) {
  const Comp = onClick ? "button" : "span";
  return (
    <Comp
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center gap-[var(--space-4)] rounded-[var(--radius-sm)] border px-[var(--space-12)] font-mono-meta transition-colors",
        size === "md" ? "h-8" : "h-10 min-h-[40px]",
        selected
          ? "border-[var(--accent-default)] bg-[var(--accent-subtle)] text-[var(--text-accent-strong)]"
          : "border-[var(--border-strong)] text-[var(--text-secondary)] hover:border-[var(--accent-default)]",
      )}
    >
      {label}
      {removable ? (
        <button
          type="button"
          aria-label={`Remove ${label}`}
          className="ml-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.();
          }}
        >
          ×
        </button>
      ) : null}
    </Comp>
  );
}

export function StatusPill({ status }: { status: ProjectStatus }) {
  const map = {
    active: {
      label: "active",
      className: "bg-[var(--accent-subtle)] text-[var(--text-accent-strong)]",
    },
    paused: {
      label: "paused",
      className: "bg-[var(--surface-secondary)] text-[var(--text-secondary)]",
    },
    completed: {
      label: "completed",
      className: "bg-[var(--surface-secondary)] text-[var(--text-secondary)]",
    },
  } as const;
  const s = map[status];
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center rounded-[var(--radius-full)] px-[var(--space-8)] font-mono-caps",
        s.className,
      )}
    >
      {s.label}
    </span>
  );
}

export function MonthSeparator({
  label,
  count,
}: {
  label: string;
  count: string;
}) {
  return (
    <div className="flex w-full items-center gap-[var(--space-16)] pb-[var(--space-8)] pt-[var(--space-24)]">
      <h2 className="font-h2 shrink-0 text-[var(--text-primary)]">{label}</h2>
      <div className="h-px min-w-px flex-1 bg-[var(--border-default)]" />
      <span className="shrink-0 font-mono-meta text-[var(--text-secondary)]">
        {count}
      </span>
    </div>
  );
}

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex w-full flex-col items-start gap-[var(--space-16)] border border-dashed border-[var(--border-strong)] bg-[var(--surface-paper)] px-[var(--space-32)] py-[var(--space-48)] rounded-[var(--radius-md)]">
      <h2 className="font-h2 text-[var(--text-primary)]">{title}</h2>
      <p className="font-body max-w-[40ch] text-[var(--text-secondary)]">{body}</p>
      {action}
    </div>
  );
}

export function Modal({
  open,
  title,
  children,
  onClose,
  actions,
}: {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  actions: ReactNode;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-[var(--space-24)]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-[var(--overlay)]"
        aria-label="Close dialog"
        onClick={onClose}
      />
      <div className="relative w-full max-w-[440px] rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--surface-paper)] p-[var(--space-32)] shadow-none">
        <h2 id="modal-title" className="font-h2 text-[var(--text-primary)]">
          {title}
        </h2>
        <div className="mt-[var(--space-12)] font-body text-[var(--text-secondary)]">
          {children}
        </div>
        <div className="mt-[var(--space-24)] flex justify-end gap-[var(--space-8)]">
          {actions}
        </div>
      </div>
    </div>
  );
}

export function IconLabel({
  icon: Icon,
  children,
}: {
  icon: LucideIcon;
  children: ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-[var(--space-4)] font-mono-meta text-[var(--text-secondary)]">
      <Icon className="size-4" aria-hidden />
      {children}
    </span>
  );
}
