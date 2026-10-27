"use client";

import { AppShell, PageHeader } from "@/components/app-shell";
import { Button, Modal } from "@/components/ui";
import { useMpb } from "@/lib/store";
import { HardDrive } from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
  const { entries, projects, clearAll, resetDemo } = useMpb();
  const [confirmClear, setConfirmClear] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  return (
    <AppShell>
      <div className="mx-auto flex w-full max-w-[var(--size-reading)] flex-col gap-[var(--space-32)] px-[var(--space-16)] py-[var(--space-24)] sm:px-[var(--space-32)] sm:py-[var(--space-40)]">
        <PageHeader
          kicker="Device"
          title="Settings"
          description="MPB keeps everything local. There is no account and no sync."
        />

        <section className="flex flex-col gap-3 border-b border-[var(--border-default)] pb-8">
          <div className="flex items-start gap-3">
            <HardDrive className="mt-1 size-5 text-[var(--accent-default)]" />
            <div>
              <h2 className="font-h2">Local storage</h2>
              <p className="mt-2 font-body text-[var(--text-secondary)]">
                Your entries stay on this device. No sync between devices or
                users.
              </p>
              <p className="mt-3 font-mono-meta text-[var(--text-secondary)]">
                {entries.length} entries · {projects.length} projects ·
                localStorage
              </p>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-4 border-b border-[var(--border-default)] pb-8">
          <h2 className="font-h2">Demo data</h2>
          <p className="font-body text-[var(--text-secondary)]">
            Reload the nine sample entries from the design (BUILD / LEARN /
            MILESTONE and the rest), or start from a blank journal.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => setConfirmReset(true)}>
              Restore demo data
            </Button>
            <Button variant="ghost" onClick={() => setConfirmClear(true)}>
              Clear all data
            </Button>
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="font-h2">About</h2>
          <p className="font-body text-[var(--text-secondary)]">
            MPB — My Personal Brag. A place to keep track of what you build,
            learn, and accomplish.
          </p>
          <p className="font-mono-meta text-[var(--text-secondary)]">
            Keep a record of your progress.
          </p>
        </section>
      </div>

      <Modal
        open={confirmClear}
        title="Clear all data?"
        onClose={() => setConfirmClear(false)}
        actions={
          <>
            <Button variant="secondary" onClick={() => setConfirmClear(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                clearAll();
                setConfirmClear(false);
              }}
            >
              Clear everything
            </Button>
          </>
        }
      >
        <p>
          This removes every entry and project from this browser. You can restore
          demo data afterwards.
        </p>
      </Modal>

      <Modal
        open={confirmReset}
        title="Restore demo data?"
        onClose={() => setConfirmReset(false)}
        actions={
          <>
            <Button variant="secondary" onClick={() => setConfirmReset(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                resetDemo();
                setConfirmReset(false);
              }}
            >
              Restore demo
            </Button>
          </>
        }
      >
        <p>
          This replaces your current journal with the nine sample entries and
          three projects from the design.
        </p>
      </Modal>
    </AppShell>
  );
}
