import { notFound } from 'next/navigation';

export default async function PreviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <main className="p-8">
      <h1>Preview works for: {slug}</h1>
      <p>Contentful integration will load after env vars are verified.</p>
    </main>
  );
}