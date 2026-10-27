import type { Entry, MpbStore, Project } from "./types";

const projects: Project[] = [
  {
    id: "proj-mpb",
    name: "MPB",
    description:
      "A personal progress journal — entries, projects, and an editorial archive. Local-first.",
    status: "active",
    startDate: "2026-07-21",
    links: [
      { id: "pl1", url: "https://github.com/arthur/mpb", label: "github.com/arthur/mpb" },
    ],
  },
  {
    id: "proj-release-tool",
    name: "Release Tool",
    description:
      "Internal CLI that tags, builds and posts release notes to the team channel.",
    status: "completed",
    startDate: "2026-08-01",
    links: [],
  },
  {
    id: "proj-parser",
    name: "Parser rewrite",
    description: "Second pass at a boring, reliable parser for config files.",
    status: "paused",
    startDate: "2026-09-01",
    links: [],
  },
];

const entries: Entry[] = [
  {
    id: "entry-009",
    number: 9,
    title: "Implemented the first version of MPB",
    date: "2026-10-26T09:42:00",
    type: "Build",
    tags: ["mpb", "design"],
    projectIds: ["proj-mpb"],
    links: [
      { id: "l9", url: "https://github.com/arthur/mpb", label: "github.com/arthur/mpb" },
    ],
    attachments: [
      { id: "a9", name: "mpb-notes-oct-26.pdf", sizeLabel: "184 KB" },
    ],
    content: `Created the initial product structure, defined the visual direction and explored a journal-inspired interface. Beige paper, thin borders, serif titles, mono for dates. No cards, no shadows.

The interface should feel like a notebook — not a task list. Entries grouped by month, with room to breathe.

Next: build the entry editor and decide how projects relate to entries.`,
    createdAt: "2026-10-26T09:42:00",
    updatedAt: "2026-10-26T09:42:00",
  },
  {
    id: "entry-008",
    number: 8,
    title: "Understanding event-driven architecture",
    date: "2026-10-25T14:10:00",
    type: "Learn",
    tags: ["architecture", "backend"],
    projectIds: [],
    links: [
      { id: "l8a", url: "https://martinfowler.com/articles/201701-event-driven.html", label: "Fowler on EDA" },
      { id: "l8b", url: "https://www.confluent.io/learn/event-driven-architecture/", label: "Confluent guide" },
    ],
    attachments: [],
    content:
      "Read through how events decouple producers from consumers. Wrote down the three patterns I kept mixing up: notification, state transfer, sourcing.",
    createdAt: "2026-10-25T14:10:00",
    updatedAt: "2026-10-25T14:10:00",
  },
  {
    id: "entry-007",
    number: 7,
    title: "Shipped a new internal tool",
    date: "2026-10-22T17:30:00",
    type: "Milestone",
    tags: ["tooling", "shipping"],
    projectIds: ["proj-release-tool"],
    links: [
      { id: "l7", url: "https://example.com/release-tool", label: "Release Tool docs" },
    ],
    attachments: [],
    content:
      "The release tool went live for the whole team today. Deploys went from a checklist to one command.",
    createdAt: "2026-10-22T17:30:00",
    updatedAt: "2026-10-22T17:30:00",
  },
  {
    id: "entry-006",
    number: 6,
    title: "What I learned from rewriting the parser twice",
    date: "2026-09-28T11:00:00",
    type: "Reflection",
    tags: ["lessons", "tooling"],
    projectIds: ["proj-parser"],
    links: [],
    attachments: [],
    content:
      "The second rewrite was faster only because I had stopped trying to be clever. Keep the first version boring.",
    createdAt: "2026-09-28T11:00:00",
    updatedAt: "2026-09-28T11:00:00",
  },
  {
    id: "entry-005",
    number: 5,
    title: "Trying local-first storage for MPB",
    date: "2026-09-19T16:20:00",
    type: "Experiment",
    tags: ["mpb", "storage"],
    projectIds: ["proj-mpb"],
    links: [],
    attachments: [{ id: "a5", name: "storage-notes.md", sizeLabel: "12 KB" }],
    content:
      "Compared IndexedDB with a plain JSON file. IndexedDB wins on search; JSON wins on export. Parking this until I need sync.",
    createdAt: "2026-09-19T16:20:00",
    updatedAt: "2026-09-19T16:20:00",
  },
  {
    id: "entry-004",
    number: 4,
    title: "Side note: why I keep entries short",
    date: "2026-09-07T09:15:00",
    type: "Note",
    tags: ["process"],
    projectIds: [],
    links: [],
    attachments: [],
    content:
      "One idea per entry. If it needs a second idea, it becomes a second entry.",
    createdAt: "2026-09-07T09:15:00",
    updatedAt: "2026-09-07T09:15:00",
  },
  {
    id: "entry-003",
    number: 3,
    title: "Wired up the first Release Tool prototype",
    date: "2026-08-30T13:45:00",
    type: "Build",
    tags: ["tooling", "cli"],
    projectIds: ["proj-release-tool"],
    links: [
      { id: "l3", url: "https://example.com/release-tool-pr", label: "Prototype PR" },
    ],
    attachments: [],
    content:
      "A CLI that tags, builds and posts to the team channel. Rough, but it already saved me two manual steps.",
    createdAt: "2026-08-30T13:45:00",
    updatedAt: "2026-08-30T13:45:00",
  },
  {
    id: "entry-002",
    number: 2,
    title: "Reading about CRDTs for the first time",
    date: "2026-08-14T10:00:00",
    type: "Learn",
    tags: ["architecture", "storage"],
    projectIds: [],
    links: [],
    attachments: [],
    content:
      "Not planning to use them. Still worth knowing why merging without a server is hard.",
    createdAt: "2026-08-14T10:00:00",
    updatedAt: "2026-08-14T10:00:00",
  },
  {
    id: "entry-001",
    number: 1,
    title: "Started keeping this journal",
    date: "2026-07-21T08:30:00",
    type: "Milestone",
    tags: ["process"],
    projectIds: ["proj-mpb"],
    links: [],
    attachments: [],
    content:
      "First entry. Setting up a place to record what I build, learn and finish.",
    createdAt: "2026-07-21T08:30:00",
    updatedAt: "2026-07-21T08:30:00",
  },
];

export function createDemoStore(): MpbStore {
  return {
    version: 1,
    entries: structuredClone(entries),
    projects: structuredClone(projects),
    nextEntryNumber: 10,
  };
}

export function createEmptyStore(): MpbStore {
  return {
    version: 1,
    entries: [],
    projects: [],
    nextEntryNumber: 1,
  };
}
