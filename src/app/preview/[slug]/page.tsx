import { NextResponse } from 'next/server';
import { getPage } from '@/lib/contentfulClient';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  try {
    const page = await getPage(slug);
    if (!page) {
      return NextResponse.json({ error: 'Page not found', slug }, { status: 404 });
    }
    return NextResponse.json(page);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}