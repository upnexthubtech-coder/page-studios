import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string; version: string }> }
) {
  const { slug, version } = await params;
  const filePath = path.join('/tmp', 'releases', slug, `${version}.json`);

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: 'Release not found' }, { status: 404 });
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  return NextResponse.json(JSON.parse(content));
}