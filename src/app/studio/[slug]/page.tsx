'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import {
  loadPage,
  addSection,
  removeSection,
  reorderSections,
  updateSectionProp,
} from '@/redux/slices/draftPageSlice';
import { selectSection } from '@/redux/slices/uiSlice';
import {
  publishing,
  publishSuccess,
  publishError,
} from '@/redux/slices/publishSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import DraftPreview from '@/components/DraftPreview';
import type { Section } from '@/lib/contentfulClient';

function getDefaultProps(type: Section['type']): Record<string, unknown> {
  switch (type) {
    case 'hero': return { headline: 'New Hero', subheadline: '' };
    case 'featureGrid': return { title: 'Features', items: [] };
    case 'testimonial': return { quote: 'Great!', author: 'User' };
    case 'cta': return { label: 'Click Here', url: '#' };
    default: return {};
  }
}

function SectionPropEditor({ section, onChange }: { section: Section; onChange: (key: string, value: unknown) => void }) {
  if (section.type === 'hero') {
    return (
      <div className="space-y-3">
        <div>
          <Label htmlFor="headline">Headline</Label>
          <Input id="headline" value={(section.props.headline as string) || ''} onChange={(e) => onChange('headline', e.target.value)} />
        </div>
        <div>
          <Label htmlFor="subheadline">Subheadline</Label>
          <Input id="subheadline" value={(section.props.subheadline as string) || ''} onChange={(e) => onChange('subheadline', e.target.value)} />
        </div>
      </div>
    );
  }
  if (section.type === 'cta') {
    return (
      <div className="space-y-3">
        <div>
          <Label htmlFor="label">Button Label</Label>
          <Input id="label" value={(section.props.label as string) || ''} onChange={(e) => onChange('label', e.target.value)} />
        </div>
        <div>
          <Label htmlFor="url">URL</Label>
          <Input id="url" value={(section.props.url as string) || ''} onChange={(e) => onChange('url', e.target.value)} />
        </div>
      </div>
    );
  }
  return <p className="text-sm text-gray-500">Editing is limited to Hero and CTA sections per sprint scope.</p>;
}

export default function StudioPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { title, sections } = useSelector((state: RootState) => state.draftPage);
  const { selectedSectionId } = useSelector((state: RootState) => state.ui);
  const publishStatus = useSelector((state: RootState) => state.publish.status);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState('viewer');

  // ---------- RBAC: read role cookie and redirect if viewer ----------
  useEffect(() => {
    const cookies = document.cookie.split(';').map(c => c.trim());
    const roleCookie = cookies.find(c => c.startsWith('role='));
    const currentRole = roleCookie ? roleCookie.split('=')[1] : 'viewer';
    setRole(currentRole);

    if (currentRole === 'viewer') {
      router.replace('/preview/home');
    }
  }, [router]);

  // ---------- Load page data ----------
  useEffect(() => {
    async function fetchPage() {
      try {
        const res = await fetch(`/api/page/${slug}`);
        if (!res.ok) throw new Error('Page not found');
        const pageData = await res.json();
        (window as any).__PAGE_ID__ = pageData.pageId;
        dispatch(loadPage(pageData));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchPage();
  }, [slug, dispatch]);

  const handleAddSection = (type: Section['type']) => {
    const newSection: Section = { id: crypto.randomUUID(), type, props: getDefaultProps(type) };
    dispatch(addSection(newSection));
    dispatch(selectSection(newSection.id));
  };

  const handlePublish = async () => {
    dispatch(publishing());
    try {
      const pageId = (window as any).__PAGE_ID__ || 'unknown';
      const res = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, title, pageId, sections }),
      });
      if (!res.ok) throw new Error('Publish failed');
      const data = await res.json();
      dispatch(publishSuccess(data.version));
      alert(`Published version ${data.version}\n${data.changelog}`);
    } catch {
      dispatch(publishError());
      alert('Publish failed');
    }
  };

  const selectedSection = sections.find(s => s.id === selectedSectionId);
  const idx = selectedSectionId ? sections.findIndex(s => s.id === selectedSectionId) : -1;

  if (loading) return <div className="flex items-center justify-center h-screen">Loading…</div>;

  return (
    <div className="h-screen flex flex-col">
      <header className="border-b px-6 py-3 flex items-center justify-between bg-white">
        <h1 className="text-xl font-semibold">Page Studio – {title || slug}</h1>
        {/* Publish button only visible for publisher */}
        {role === 'publisher' && (
          <Button onClick={handlePublish} disabled={publishStatus === 'loading'}>
            {publishStatus === 'loading' ? 'Publishing…' : 'Publish'}
          </Button>
        )}
      </header>

      <div className="flex-1 grid grid-cols-3 overflow-hidden">
        <aside className="bg-gray-50 border-r p-4 overflow-y-auto">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Sections</h2>
          {sections.map((section, index) => (
            <div
              key={section.id}
              className={`p-2 mb-1 rounded cursor-pointer flex justify-between text-sm ${selectedSectionId === section.id ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-200'}`}
              onClick={() => dispatch(selectSection(section.id))}
            >
              <span className="capitalize">{section.type} {index + 1}</span>
              <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); dispatch(removeSection(section.id)); if (selectedSectionId === section.id) dispatch(selectSection(null)); }}>✕</Button>
            </div>
          ))}
          <Separator className="my-4" />
          <div className="grid grid-cols-1 gap-2">
            {(['hero', 'featureGrid', 'testimonial', 'cta'] as const).map(type => (
              <Button key={type} variant="outline" size="sm" onClick={() => handleAddSection(type)}>+ Add {type}</Button>
            ))}
          </div>
        </aside>

        <main className="col-span-1 p-6 overflow-y-auto border-r">
          {selectedSection ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold capitalize">{selectedSection.type} Properties</h2>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" disabled={idx === 0} onClick={() => dispatch(reorderSections({ fromIndex: idx, toIndex: idx - 1 }))}>↑ Up</Button>
                  <Button size="sm" variant="outline" disabled={idx === sections.length - 1} onClick={() => dispatch(reorderSections({ fromIndex: idx, toIndex: idx + 1 }))}>↓ Down</Button>
                </div>
              </div>
              <SectionPropEditor section={selectedSection} onChange={(key, value) => dispatch(updateSectionProp({ sectionId: selectedSection.id, key, value }))} />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <span className="text-6xl mb-4">⚙️</span>
              <p>Select a section to edit</p>
            </div>
          )}
        </main>

        <section className="col-span-1 p-4 bg-gray-50">
          <DraftPreview />
        </section>
      </div>
    </div>
  );
}