"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  filterEntries,
  localStorageRepository,
  newId,
  sortEntriesDesc,
} from "./repository";
import type { Entry, EntryCategory, MpbStore, Project, ProjectStatus } from "./types";
import { todayIso } from "./dates";

type StoreContextValue = {
  ready: boolean;
  store: MpbStore;
  entries: Entry[];
  projects: Project[];
  createEntry: (input: Partial<Entry> & { title?: string; content?: string }) => Entry;
  updateEntry: (id: string, patch: Partial<Entry>) => Entry | null;
  deleteEntry: (id: string) => void;
  getEntry: (id: string) => Entry | undefined;
  neighbors: (id: string) => { prev?: Entry; next?: Entry };
  createProject: (input: {
    name: string;
    description?: string;
    status?: ProjectStatus;
  }) => Project;
  updateProject: (id: string, patch: Partial<Project>) => Project | null;
  deleteProject: (id: string) => void;
  getProject: (id: string) => Project | undefined;
  search: (opts: {
    query?: string;
    category?: string;
    tag?: string;
    projectId?: string;
  }) => Entry[];
  clearAll: () => void;
  resetDemo: () => void;
};

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [store, setStore] = useState<MpbStore>(() => ({
    version: 1,
    entries: [],
    projects: [],
    nextEntryNumber: 1,
  }));

  useEffect(() => {
    const loaded = localStorageRepository.load();
    setStore(loaded);
    setReady(true);
  }, []);

  const persist = useCallback((next: MpbStore) => {
    setStore(next);
    localStorageRepository.save(next);
  }, []);

  const createEntry = useCallback(
    (input: Partial<Entry> & { title?: string; content?: string }) => {
      const now = todayIso();
      const entry: Entry = {
        id: newId("entry"),
        title: input.title?.trim() || "Untitled",
        date: input.date || now,
        content: input.content ?? "",
        type: input.type,
        tags: input.tags ?? [],
        projectIds: input.projectIds ?? [],
        links: input.links ?? [],
        attachments: input.attachments ?? [],
        number: store.nextEntryNumber,
        createdAt: now,
        updatedAt: now,
      };
      persist({
        ...store,
        entries: [entry, ...store.entries],
        nextEntryNumber: store.nextEntryNumber + 1,
      });
      return entry;
    },
    [persist, store],
  );

  const updateEntry = useCallback(
    (id: string, patch: Partial<Entry>) => {
      const idx = store.entries.findIndex((e) => e.id === id);
      if (idx < 0) return null;
      const current = store.entries[idx];
      const updated: Entry = {
        ...current,
        ...patch,
        id: current.id,
        number: current.number,
        updatedAt: todayIso(),
      };
      const entries = [...store.entries];
      entries[idx] = updated;
      persist({ ...store, entries });
      return updated;
    },
    [persist, store],
  );

  const deleteEntry = useCallback(
    (id: string) => {
      persist({
        ...store,
        entries: store.entries.filter((e) => e.id !== id),
      });
    },
    [persist, store],
  );

  const getEntry = useCallback(
    (id: string) => store.entries.find((e) => e.id === id),
    [store.entries],
  );

  const neighbors = useCallback(
    (id: string) => {
      const sorted = sortEntriesDesc(store.entries);
      const i = sorted.findIndex((e) => e.id === id);
      if (i < 0) return {};
      return {
        // previous in journal = older = higher index
        prev: sorted[i + 1],
        next: sorted[i - 1],
      };
    },
    [store.entries],
  );

  const createProject = useCallback(
    (input: { name: string; description?: string; status?: ProjectStatus }) => {
      const project: Project = {
        id: newId("proj"),
        name: input.name.trim() || "Untitled project",
        description: input.description?.trim() ?? "",
        status: input.status ?? "active",
        startDate: todayIso().slice(0, 10),
        links: [],
      };
      persist({ ...store, projects: [...store.projects, project] });
      return project;
    },
    [persist, store],
  );

  const updateProject = useCallback(
    (id: string, patch: Partial<Project>) => {
      const idx = store.projects.findIndex((p) => p.id === id);
      if (idx < 0) return null;
      const updated = { ...store.projects[idx], ...patch, id };
      const projects = [...store.projects];
      projects[idx] = updated;
      persist({ ...store, projects });
      return updated;
    },
    [persist, store],
  );

  const deleteProject = useCallback(
    (id: string) => {
      persist({
        ...store,
        projects: store.projects.filter((p) => p.id !== id),
        entries: store.entries.map((e) => ({
          ...e,
          projectIds: e.projectIds.filter((pid) => pid !== id),
        })),
      });
    },
    [persist, store],
  );

  const getProject = useCallback(
    (id: string) => store.projects.find((p) => p.id === id),
    [store.projects],
  );

  const search = useCallback(
    (opts: {
      query?: string;
      category?: string;
      tag?: string;
      projectId?: string;
    }) => filterEntries(store.entries, opts),
    [store.entries],
  );

  const clearAll = useCallback(() => {
    localStorageRepository.clear();
    setStore({ version: 1, entries: [], projects: [], nextEntryNumber: 1 });
  }, []);

  const resetDemo = useCallback(() => {
    const demo = localStorageRepository.resetDemo();
    setStore(demo);
  }, []);

  const value = useMemo<StoreContextValue>(
    () => ({
      ready,
      store,
      entries: sortEntriesDesc(store.entries),
      projects: store.projects,
      createEntry,
      updateEntry,
      deleteEntry,
      getEntry,
      neighbors,
      createProject,
      updateProject,
      deleteProject,
      getProject,
      search,
      clearAll,
      resetDemo,
    }),
    [
      ready,
      store,
      createEntry,
      updateEntry,
      deleteEntry,
      getEntry,
      neighbors,
      createProject,
      updateProject,
      deleteProject,
      getProject,
      search,
      clearAll,
      resetDemo,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useMpb() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useMpb must be used within StoreProvider");
  return ctx;
}

export type { EntryCategory };
