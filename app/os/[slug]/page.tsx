import Link from "next/link";
import { notFound } from "next/navigation";
import { OsLayout } from "@/components/OsLayout";
import { NoteCard } from "@/components/NoteCard";
import { getSlugPageData } from "@/lib/server/slug-page";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug: urlSlug } = await params;
  const data = await getSlugPageData(urlSlug);

  if (!data) notFound();

  const { slug, project, notes, health, healthDotColor, accent } = data;

  return (
    <OsLayout
      title={project.name}
      icon={<span className="text-2xl">{project.icon ?? "📁"}</span>}
      headerRight={
        <div className="flex items-center gap-2">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs capitalize"
            style={{
              backgroundColor: `${healthDotColor}25`,
              color: healthDotColor,
            }}
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: healthDotColor }}
            />
            {health}
          </span>
          <Link
            href={`/os/new?project=${slug}`}
            className="btn-primary text-sm"
          >
            + Note
          </Link>
        </div>
      }
    >
      <div
        className="mb-6 rounded-lg border border-border p-4"
        style={{ borderLeftColor: accent, borderLeftWidth: 3 }}
      >
        <p className="text-sm text-muted">
          Phase 5 will add metrics and AI context here. For now: project notes
          only.
        </p>
      </div>

      {notes.length === 0 ? (
        <p className="text-center text-muted">No notes for this project yet.</p>
      ) : (
        <div className="space-y-4">
          {notes.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      )}
    </OsLayout>
  );
}
