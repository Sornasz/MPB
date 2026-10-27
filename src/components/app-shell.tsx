"use client";

import { MobileTabBar, MobileTopBar, Sidebar } from "@/components/sidebar";
import { Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, type ReactNode } from "react";

function Fab({ hideFab }: { hideFab?: boolean }) {
  const pathname = usePathname();
  const isEditor =
    pathname.startsWith("/entries/new") || pathname.includes("/edit");
  if (hideFab || isEditor) return null;
  return (
    <Link
      href="/entries/new"
      className="fixed bottom-[calc(var(--size-tabbar)+16px)] right-4 z-40 md:hidden"
      aria-label="New entry"
    >
      <span className="inline-flex h-[var(--size-fab)] items-center gap-2 rounded-[var(--radius-md)] bg-[var(--accent-default)] px-4 font-ui text-[var(--text-on-accent)]">
        <Plus className="size-5" aria-hidden />
        New entry
      </span>
    </Link>
  );
}

export function AppShell({
  children,
  hideFab,
}: {
  children: ReactNode;
  hideFab?: boolean;
}) {
  return (
    <div className="flex min-h-dvh bg-[var(--bg-default)]">
      <Suspense fallback={<aside className="hidden w-[var(--size-sidebar)] shrink-0 bg-[var(--surface-secondary)] md:block" />}>
        <Sidebar />
      </Suspense>
      <div className="flex min-w-0 flex-1 flex-col pb-[calc(var(--size-tabbar)+16px)] md:pb-0">
        <MobileTopBar />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
      <Suspense fallback={null}>
        <Fab hideFab={hideFab} />
      </Suspense>
      <Suspense fallback={<nav className="fixed inset-x-0 bottom-0 h-[var(--size-tabbar)] border-t border-[var(--border-default)] bg-[var(--surface-paper)] md:hidden" />}>
        <MobileTabBar />
      </Suspense>
    </div>
  );
}

export function PageHeader({
  kicker,
  title,
  description,
  actions,
}: {
  kicker?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-[var(--space-16)] sm:flex-row sm:items-end sm:justify-between sm:gap-[var(--space-24)]">
      <div className="flex min-w-0 flex-col gap-[var(--space-4)]">
        {kicker ? (
          <p className="font-mono-caps text-[var(--text-secondary)]">{kicker}</p>
        ) : null}
        <h1 className="font-display text-[var(--text-primary)]">{title}</h1>
        {description ? (
          <p className="font-body text-[var(--text-secondary)]">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}

export function NewEntryButton() {
  return (
    <Link
      href="/entries/new"
      className="hidden h-[var(--size-touch)] items-center gap-[var(--space-8)] rounded-[var(--radius-md)] bg-[var(--accent-default)] px-[var(--space-20)] font-ui text-[var(--text-on-accent)] no-underline hover:bg-[var(--accent-hover)] md:inline-flex"
    >
      <Plus className="size-5" aria-hidden />
      New entry
    </Link>
  );
}
