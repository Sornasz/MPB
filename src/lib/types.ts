export type EntryCategory =
  | "Build"
  | "Learn"
  | "Milestone"
  | "Experiment"
  | "Reflection"
  | "Note";

export type ProjectStatus = "active" | "paused" | "completed";

export type EntryLink = {
  id: string;
  url: string;
  label?: string;
};

export type EntryAttachment = {
  id: string;
  name: string;
  sizeLabel?: string;
};

export type Entry = {
  id: string;
  title: string;
  date: string; // ISO date or datetime
  content: string;
  type?: EntryCategory;
  tags: string[];
  projectIds: string[];
  links: EntryLink[];
  attachments: EntryAttachment[];
  number: number;
  createdAt: string;
  updatedAt: string;
};

export type Project = {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  startDate: string;
  links: EntryLink[];
};

export type MpbStore = {
  version: 1;
  entries: Entry[];
  projects: Project[];
  nextEntryNumber: number;
};

export const ENTRY_CATEGORIES: EntryCategory[] = [
  "Build",
  "Learn",
  "Milestone",
  "Experiment",
  "Reflection",
  "Note",
];

export const STORAGE_KEY = "mpb.journal.v1";
export const DEMO_FLAG_KEY = "mpb.demo.seeded";
