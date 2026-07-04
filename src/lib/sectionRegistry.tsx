import HeroSection from '@/components/sections/HeroSection';
import FeatureGridSection from '@/components/sections/FeatureGridSection';
import TestimonialSection from '@/components/sections/TestimonialSection';
import CTASection from '@/components/sections/CTASection';
import { sectionSchema } from '@/lib/schemas';

export const sectionRegistry = {
  hero: { component: HeroSection, schema: sectionSchema },
  featureGrid: { component: FeatureGridSection, schema: sectionSchema },
  testimonial: { component: TestimonialSection, schema: sectionSchema },
  cta: { component: CTASection, schema: sectionSchema },
} as const;

export function UnsupportedSection({ type }: { type: string }) {
  return (
    <div className="p-8 border-2 border-dashed border-gray-400 text-center text-gray-500">
      ⚠️ Unsupported section type: <strong>{type}</strong>
    </div>
  );
}