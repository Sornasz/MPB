"use client";

import { Logo } from "@/components/logo";
import { cn } from "@/lib/cn";
import {
  Archive,
  BookOpen,
  Folder,
  HardDrive,
  Settings,
  Tags,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/", label: "Journal", icon: BookOpen, match: (p: string) => p === "/" || p.startsWith("/entries") },
  { href: "/projects", label: "Projects", icon: Folder, match: (p: string) => p.startsWith("/projects") },
  { href: "/archive", label: "Archive", icon: Archive, match: (p: string) => p.startsWith("/archive") },
  { href: "/tags", label: "Tags", icon: Tags, match: (p: string) => p.startsWith("/tags") },
  { href: "/settings", label: "Settings", icon: Settings, match: (p: string) => p.startsWith("/settings") },
] as const;

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-dvh w-[var(--size-sidebar)] shrink-0 flex-col gap-[var(--space-4)] bg-[var(--surface-secondary)] px-[var(--space-16)] py-[var(--space-24)] md:flex">
      <div className="px-[var(--space-12)]">
        <Logo size="md" />
      </div>
      <div className="h-8" aria-hidden />
      <nav className="flex flex-col gap-[var(--space-4)]" aria-label="Main">
        {nav.map((item) => {
          const active = item.match(pathname);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex h-[var(--size-nav-item)] items-center gap-[var(--space-12)] rounded-[var(--radius-md)] px-[var(--space-12)] font-ui no-underline transition-colors",
                active
                  ? "border border-[var(--border-default)] bg-[var(--surface-paper)] text-[var(--text-primary)]"
                  : "text-[var(--text-secondary)] hover:bg-[var(--surface-paper)]/60 hover:text-[var(--text-primary)]",
              )}
              aria-current={active ? "page" : undefined}
            >
              <Icon
                className={cn(
                  "size-5",
                  active ? "text-[var(--accent-default)]" : "text-current",
                )}
                aria-hidden
              />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="flex-1" />
      <div className="h-px w-full bg-[var(--border-default)]" />
      <div className="flex items-center gap-[var(--space-8)] px-[var(--space-12)] pt-[var(--space-12)]">
        <HardDrive className="size-5 text-[var(--text-secondary)]" aria-hidden />
        <p className="font-caption text-[var(--text-secondary)]">
          Saved on this device
        </p>
      </div>
    </aside>
  );
}

export function MobileTopBar({
  onSearchFocus,
}: {
  onSearchFocus?: () => void;
}) {
  return (
    <header className="flex items-center justify-between gap-3 border-b border-[var(--border-default)] px-[var(--space-16)] py-[var(--space-12)] md:hidden">
      <Logo size="sm" />
      <button
        type="button"
        className="inline-flex size-11 items-center justify-center rounded-[var(--radius-md)] text-[var(--text-secondary)] hover:bg-[var(--surface-secondary)]"
        aria-label="Search"
        onClick={onSearchFocus}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
      </button>
    </header>
  );
}

export function MobileTabBar() {
  const pathname = usePathname();
  const tabs = nav.filter((n) => n.href !== "/settings");

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 flex h-[var(--size-tabbar)] items-stretch border-t border-[var(--border-default)] bg-[var(--surface-paper)] md:hidden"
      aria-label="Mobile"
    >
      {tabs.map((item) => {
        const active = item.match(pathname);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-1 flex-col items-center justify-center gap-0.5 font-caption no-underline",
              active
                ? "bg-[var(--accent-subtle)] text-[var(--text-accent-strong)]"
                : "text-[var(--text-secondary)]",
            )}
            aria-current={active ? "page" : undefined}
          >
            <Icon className="size-5" aria-hidden />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
