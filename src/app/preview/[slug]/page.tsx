import { notFound } from 'next/navigation';
import { getPage } from '@/lib/contentfulClient';
import { pageSchema } from '@/lib/schemas';
import { sectionRegistry, UnsupportedSection } from '@/lib/sectionRegistry';

export default async function PreviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const rawPage = await getPage(slug);

  if (!rawPage) notFound();

  const parsed = pageSchema.safeParse(rawPage);
  if (!parsed.success) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-red-600">Invalid Page Data</h1>
        <pre className="mt-4 text-left text-sm">
          {JSON.stringify(parsed.error.issues, null, 2)}
        </pre>
      </div>
    );
  }

  const page = parsed.data;

  return (
    <main>
      {page.sections.map((section, index) => {
        const entry = sectionRegistry[section.type];
        if (!entry)
          return (
            <UnsupportedSection
              key={section.id || index}
              type={section.type}
            />
          );
        const Component = entry.component;
        return (
          <Component
            key={section.id || index}
            props={section.props}
          />
        );
      })}
    </main>
  );
}