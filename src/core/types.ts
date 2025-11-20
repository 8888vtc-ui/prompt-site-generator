export type Language = 'fr' | 'en';

export type PageType =
  | 'pillar'
  | 'city'
  | 'transfer'
  | 'usage'
  | 'pricing'
  | 'booking';

export type PageTemplate =
  | 'homepage'
  | 'service_pillar'
  | 'service_secondary'
  | 'location'
  | 'pricing'
  | 'contact'
  | 'about'
  | 'faq'
  | 'legal';

export interface SiteProfile {
  id: string;
  name: string;
  domain?: string;
  activity: string;
  positioning: string;
  zones: string;
  targetAudience: string;
  tone: string;
  mainGoal: string;
  primaryCTA: string;
  contactChannels: {
    whatsapp?: boolean;
    phone?: boolean;
    form?: boolean;
  };
}

export interface PagePlanEntry {
  slug: string;
  keyword: string;
  language: Language;
  pageType: PageType;
  template?: PageTemplate;
  location: string;
  authority: boolean;
  wordcount: number;
}

export interface SubSection {
  title: string;
  content: string;
}

export interface Section {
  h2: string;
  content: string;
  h3?: SubSection[];
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface InternalLink {
  anchor: string;
  url: string;
  context: string;
}

export interface ImageMeta {
  src?: string;
  alt: string;
  description?: string;
  prompt?: string;
}

export interface GeneratedContent {
  title: string;
  meta_title: string;
  meta_description: string;
  introduction: string;
  sections: Section[];
  faq: FAQItem[];
  internal_links: InternalLink[];
  wordcount: number;
  base_css?: string;
   hero_image?: ImageMeta;
}

export type SEOViolationSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface SEOIssue {
  code: string;
  message: string;
  severity: SEOViolationSeverity;
}

export interface SEOMetrics {
  titleLength: number;
  metaDescriptionLength: number;
  headingCount: { h1: number; h2: number; h3: number };
  wordCount: number;
  keywordDensity: number;
  internalLinks: number;
  externalLinks: number;
  readabilityScore: number;
}

export interface SEOResult {
  score: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  issues: SEOIssue[];
  metrics: SEOMetrics;
  recommendations: string[];
  passedChecks: string[];
  failedChecks: string[];
}

export interface PipelineInput {
  profile: SiteProfile;
  page: PagePlanEntry;
  url: string;
}

export interface PipelineResult {
  content: GeneratedContent;
  seo: SEOResult;
  rawText: string;
}
