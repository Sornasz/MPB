import { createDemoStore, createEmptyStore } from "./seed";
import type { Entry, MpbStore, Project } from "./types";
import { DEMO_FLAG_KEY, STORAGE_KEY } from "./types";

export type MpbRepository = {
  load(): MpbStore;
  save(store: MpbStore): void;
  clear(): void;
  resetDemo(): MpbStore;
};

function isBrowser() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function parseStore(raw: string | null): MpbStore | null {
  if (!raw) return null;
  try {
    const data = JSON.parse(raw) as MpbStore;
    if (!data || data.version !== 1 || !Array.isArray(data.entries)) return null;
    return data;
  } catch {
    return null;
  }
}

export const localStorageRepository: MpbRepository = {
  load() {
    if (!isBrowser()) return createDemoStore();
    const existing = parseStore(localStorage.getItem(STORAGE_KEY));
    if (existing) return existing;
    const demo = createDemoStore();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(demo));
    localStorage.setItem(DEMO_FLAG_KEY, "1");
    return demo;
  },

  save(store) {
    if (!isBrowser()) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  },

  clear() {
    if (!isBrowser()) return;
    const empty = createEmptyStore();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(empty));
    localStorage.removeItem(DEMO_FLAG_KEY);
  },

  resetDemo() {
    const demo = createDemoStore();
    if (isBrowser()) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(demo));
      localStorage.setItem(DEMO_FLAG_KEY, "1");
    }
    return demo;
  },
};

export function sortEntriesDesc(entries: Entry[]): Entry[] {
  return [...entries].sort((a, b) => {
    if (a.date === b.date) return b.number - a.number;
    return a.date < b.date ? 1 : -1;
  });
}

export function excerptFromContent(content: string, max = 160): string {
  const plain = content.replace(/\s+/g, " ").trim();
  if (plain.length <= max) return plain;
  return `${plain.slice(0, max).trimEnd()}…`;
}

export function allTags(entries: Entry[]): string[] {
  const set = new Set<string>();
  for (const e of entries) for (const t of e.tags) set.add(t);
  return [...set].sort((a, b) => a.localeCompare(b));
}

export function filterEntries(
  entries: Entry[],
  opts: {
    query?: string;
    category?: string;
    tag?: string;
    projectId?: string;
  },
): Entry[] {
  const q = opts.query?.trim().toLowerCase();
  return sortEntriesDesc(entries).filter((e) => {
    if (opts.category && e.type !== opts.category) return false;
    if (opts.tag && !e.tags.includes(opts.tag)) return false;
    if (opts.projectId && !e.projectIds.includes(opts.projectId)) return false;
    if (!q) return true;
    const hay = `${e.title}\n${e.content}\n${e.tags.join(" ")}`.toLowerCase();
    return hay.includes(q);
  });
}

export function newId(prefix: string): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
  }
  return `${prefix}-${Date.now().toString(36)}`;
}

export function upsertProject(store: MpbStore, project: Project): MpbStore {
  const idx = store.projects.findIndex((p) => p.id === project.id);
  const projects = [...store.projects];
  if (idx >= 0) projects[idx] = project;
  else projects.push(project);
  return { ...store, projects };
}
