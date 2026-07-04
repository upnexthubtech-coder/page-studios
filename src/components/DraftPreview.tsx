'use client';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { sectionRegistry, UnsupportedSection } from '@/lib/sectionRegistry';

export default function DraftPreview() {
  const sections = useSelector((state: RootState) => state.draftPage.sections);

  return (
    <div className="border rounded-lg p-4 h-full overflow-y-auto bg-white shadow-inner">
      <div className="text-sm text-gray-400 mb-2 uppercase tracking-wide">
        Draft Preview
      </div>
      {sections.length === 0 ? (
        <p className="text-gray-400 italic text-center py-12">
          No sections added yet.
        </p>
      ) : (
        sections.map((section, i) => {
          const entry = sectionRegistry[section.type];
          if (!entry)
            return (
              <UnsupportedSection
                key={section.id || i}
                type={section.type}
              />
            );
          const Component = entry.component;
          return (
            <Component
              key={section.id || i}
              props={section.props}
            />
          );
        })
      )}
    </div>
  );
}