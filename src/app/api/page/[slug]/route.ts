import { NextResponse } from 'next/server';
import { getPage } from '@/lib/contentfulClient';

export async function GET(
  _: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const page = await getPage(slug);
  if (!page) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(page);
}