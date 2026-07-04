import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { computeBump, parseVersion } from '@/lib/diffUtils';
import { Section } from '@/lib/contentfulClient';

export async function POST(req: NextRequest) {
  // ---------- RBAC (server‑side) ----------
  const cookieHeader = req.headers.get('cookie') || '';
  const roleMatch = cookieHeader.match(/(?:^|;\s*)role=([^;]*)/);
  const role = roleMatch ? roleMatch[1] : 'viewer';

  if (role !== 'publisher') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  // ----------------------------------------

  const { slug, title, pageId, sections } = await req.json();
  if (!slug || !sections) {
    return NextResponse.json({ error: 'Missing slug or sections' }, { status: 400 });
  }

  // Use /tmp (writable on Vercel) instead of public/
  const dir = path.join('/tmp', 'releases', slug);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const files = fs.readdirSync(dir).filter(f => f.endsWith('.json')).sort();
  let lastSections: Section[] = [];
  let lastVersionStr = '1.0.0';

  if (files.length > 0) {
    const latestFile = files[files.length - 1];
    lastVersionStr = latestFile.replace('.json', '');
    const content = JSON.parse(fs.readFileSync(path.join(dir, latestFile), 'utf-8'));
    lastSections = content.sections || [];
  }

  const bump = computeBump(lastSections, sections);
  const lastV = parseVersion(lastVersionStr);

  let newMajor = lastV.major;
  let newMinor = lastV.minor;
  let newPatch = lastV.patch;

  if (bump.changelog.includes('removed') || bump.changelog.includes('Type changed') || bump.changelog.includes('Removed required')) {
    newMajor += 1; newMinor = 0; newPatch = 0;
  } else if (bump.changelog.includes('added') || bump.changelog.includes('Added prop')) {
    newMinor += 1; newPatch = 0;
  } else {
    newPatch += 1;
  }

  const newVersion = `${newMajor}.${newMinor}.${newPatch}`;
  const snapshot = {
    pageId,
    slug,
    title,
    sections,
    version: newVersion,
    changelog: bump.changelog,
    publishedAt: new Date().toISOString(),
  };

  fs.writeFileSync(path.join(dir, `${newVersion}.json`), JSON.stringify(snapshot, null, 2));

  return NextResponse.json({
    version: newVersion,
    changelog: bump.changelog,
    snapshot,             // optional: send the snapshot back for the UI
  });
}