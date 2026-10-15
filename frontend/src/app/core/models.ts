export interface Service {
  id: number;
  title: string;
  slug: string;
  summary: string;
  body: string | null;
  icon: string | null;
  image: string | null;
  highlights: string[] | null;
  sort_order: number;
  is_featured: boolean;
  is_active: boolean;
}

export interface ProcessStep {
  id: number;
  step_number: number;
  title: string;
  slug: string;
  summary: string;
  body: string | null;
  icon: string | null;
  image: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface Project {
  id: number;
  title: string;
  slug: string;
  client: string | null;
  summary: string;
  body: string | null;
  technologies: string[] | null;
  cover_image: string | null;
  gallery: string[] | null;
  project_url: string | null;
  is_featured: boolean;
  is_published: boolean;
  completed_at: string | null;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
}

export interface Author {
  id: number;
  name: string;
  avatar: string | null;
}

export interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  body: string;
  image: string | null;
  is_published: boolean;
  published_at: string | null;
  views: number;
  category: Category | null;
  author?: Author | null;
}

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  bio: string | null;
  image: string | null;
  email: string | null;
  linkedin_url: string | null;
  x_url: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface Testimonial {
  id: number;
  author_name: string;
  author_role: string | null;
  author_company: string | null;
  quote: string;
  avatar: string | null;
  rating: number;
  sort_order: number;
  is_active: boolean;
}

export interface SearchResultItem {
  type: 'service' | 'project' | 'post' | 'page' | 'team';
  id?: number;
  title: string;
  slug: string;
  summary?: string | null;
  route: string;
  image?: string | null;
  client?: string | null;
  published_at?: string | null;
  category?: string | null;
  author?: string | null;
  role?: string | null;
}

export interface SearchResult {
  query: string;
  total: number;
  results: SearchResultItem[];
}

export interface Paginated<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  links: { url: string | null; label: string }[];
}

export interface HomeStats {
  projects_completed: number;
  services_offered: number;
  team_members: number;
  articles_published: number;
}

export type SiteSettings = Record<string, string | null>;

export interface ContactPayload {
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  subject?: string | null;
  message: string;
  website?: string | null;
  type?: string | null;
  quantity?: number | null;
  teamSize?: string | null;
  timeline?: string | null;
  budget?: string | null;
  dynamicData?: Record<string, unknown> | null;
}

export interface ContactResponse {
  message: string;
  reference?: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  ip_address: string | null;
  is_read: boolean;
  created_at: string;
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'editor';
  avatar: string | null;
}