import { createClient } from 'contentful';

let client: ReturnType<typeof createClient> | null = null;
let previewClient: ReturnType<typeof createClient> | null = null;

function getClient(preview = false) {
  if (preview) {
    if (!previewClient) {
      previewClient = createClient({
        space: process.env.CONTENTFUL_SPACE_ID!,
        accessToken: process.env.CONTENTFUL_PREVIEW_TOKEN!,
        environment: process.env.CONTENTFUL_ENVIRONMENT || 'master',
        host: 'preview.contentful.com',
      });
    }
    return previewClient;
  }

  if (!client) {
    client = createClient({
      space: process.env.CONTENTFUL_SPACE_ID!,
      accessToken: process.env.CONTENTFUL_DELIVERY_TOKEN!,
      environment: process.env.CONTENTFUL_ENVIRONMENT || 'master',
    });
  }
  return client;
}

export type SectionType = 'hero' | 'featureGrid' | 'testimonial' | 'cta';

export interface Section {
  id: string;
  type: SectionType;
  props: Record<string, unknown>;
}

export interface Page {
  pageId: string;
  slug: string;
  title: string;
  sections: Section[];
}

function mapSection(raw: any): Section {
  const contentTypeId = raw.sys.contentType.sys.id;
  if (contentTypeId === 'section') {
    const sectionType = raw.fields.type as SectionType;
    const props = raw.fields.props || {};
    return { id: raw.sys.id, type: sectionType, props };
  }

  let props: Record<string, unknown> = {};
  switch (contentTypeId) {
    case 'hero':
      props = {
        headline: raw.fields.headline,
        subheadline: raw.fields.subheadline,
        backgroundImage: raw.fields.backgroundImage?.fields?.file?.url ?? null,
      };
      break;
    case 'featureGrid':
      props = { title: raw.fields.title, items: raw.fields.items || [] };
      break;
    case 'testimonial':
      props = { quote: raw.fields.quote, author: raw.fields.author, role: raw.fields.role };
      break;
    case 'cta':
      props = { label: raw.fields.label, url: raw.fields.url, style: raw.fields.style ?? 'primary' };
      break;
    default:
      return { id: raw.sys.id, type: contentTypeId as SectionType, props: raw.fields || {} };
  }

  return { id: raw.sys.id, type: contentTypeId as SectionType, props };
}

export async function getPage(slug: string, preview = false): Promise<Page | null> {
  const c = getClient(preview);
  const entries = await c.getEntries({
    content_type: 'pageStudio',
    'fields.slug': slug,
    include: 2,
  });

  if (entries.items.length === 0) return null;
  const rawPage = entries.items[0];

  // TypeScript fix: cast sections to an array of any
  const rawSections: any[] = (rawPage.fields as any).sections || [];
  const sections = rawSections.map(mapSection);

  return {
    pageId: rawPage.sys.id,
    slug: rawPage.fields.slug as string,
    title: rawPage.fields.title as string,
    sections,
  };
}