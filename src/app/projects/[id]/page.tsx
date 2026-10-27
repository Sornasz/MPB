import { ProjectDetailClient } from "@/components/project-detail-client";
import { Suspense } from "react";

async function ProjectDetailBody({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProjectDetailClient id={id} />;
}

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <p className="p-8 font-body text-[var(--text-secondary)]">Loading…</p>
      }
    >
      <ProjectDetailBody params={params} />
    </Suspense>
  );
}
