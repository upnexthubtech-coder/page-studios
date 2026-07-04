import { z } from 'zod';

const heroSchema = z.object({
  headline: z.string().min(1),
  subheadline: z.string().optional(),
  backgroundImage: z.string().nullable().optional(),
});

const featureGridSchema = z.object({
  title: z.string().min(1),
  items: z.array(z.object({
    icon: z.string().optional(),
    title: z.string(),
    description: z.string(),
  })),
});

const testimonialSchema = z.object({
  quote: z.string().min(1),
  author: z.string().min(1),
  role: z.string().optional(),
});

const ctaSchema = z.object({
  label: z.string().min(1),
  url: z.string().min(1),
  style: z.enum(['primary', 'secondary']).optional(),
});

export const sectionSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('hero'), id: z.string(), props: heroSchema }),
  z.object({ type: z.literal('featureGrid'), id: z.string(), props: featureGridSchema }),
  z.object({ type: z.literal('testimonial'), id: z.string(), props: testimonialSchema }),
  z.object({ type: z.literal('cta'), id: z.string(), props: ctaSchema }),
]);

export const pageSchema = z.object({
  pageId: z.string(),
  slug: z.string(),
  title: z.string(),
  sections: z.array(sectionSchema),
});