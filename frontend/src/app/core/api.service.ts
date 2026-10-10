import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { APP_CONFIG } from '../../environments/app-config.model';
import {
  AdminUser,
  Category,
  ContactMessage,
  ContactPayload,
  ContactResponse,
  HomeStats,
  Paginated,
  Post,
  ProcessStep,
  Project,
  SearchResult,
  Service,
  SiteSettings,
  TeamMember,
  Testimonial,
} from './models';

export interface FieldErrors {
  [field: string]: string[];
}

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly errors: FieldErrors,
  ) {
    super(message);
    this.name = 'ApiError';
  }

  get firstError(): string | null {
    const keys = Object.keys(this.errors);
    return keys.length ? this.errors[keys[0]][0] : null;
  }
}

const TOKEN_KEY = 'otuyaelite.token';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(APP_CONFIG);
  private token: string | null = localStorage.getItem(TOKEN_KEY);

  setToken(token: string | null): void {
    this.token = token;
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  }

  getToken(): string | null {
    return this.token;
  }

  private url(path: string): string {
    return `${this.config.apiUrl}/${path.replace(/^\//, '')}`;
  }

  private authHeaders(): HttpHeaders {
    return this.token ? new HttpHeaders({ Authorization: `Bearer ${this.token}` }) : new HttpHeaders();
  }

  private handle<T>(source: Observable<T>): Observable<T> {
    return source.pipe(
      catchError((error: HttpErrorResponse) => {
        const payload = error.error ?? {};
        const errors: FieldErrors = payload.errors ?? {};
        const message = payload.message ?? 'Something went wrong. Please try again.';
        return throwError(() => new ApiError(message, error.status, errors));
      }),
    );
  }

  private get<T>(path: string, params?: Record<string, string | number | boolean>): Observable<T> {
    return this.handle(this.http.get<T>(this.url(path), { headers: this.authHeaders(), params }));
  }

  private send<T>(path: string, body: unknown): Observable<T> {
    return this.handle(this.http.post<T>(this.url(path), body, { headers: this.authHeaders() }));
  }

  private put<T>(path: string, body: unknown): Observable<T> {
    return this.handle(this.http.put<T>(this.url(path), body, { headers: this.authHeaders() }));
  }

  private patch<T>(path: string, body: unknown): Observable<T> {
    return this.handle(this.http.patch<T>(this.url(path), body, { headers: this.authHeaders() }));
  }

  private delete<T>(path: string): Observable<T> {
    return this.handle(this.http.delete<T>(this.url(path), { headers: this.authHeaders() }));
  }

  login(email: string, password: string) {
    return this.send<{ token: string; user: AdminUser }>('login', { email, password }).pipe(
      map((res) => {
        this.setToken(res.token);
        return res.user;
      }),
    );
  }

  logout(): Observable<unknown> {
    return this.send('logout', {}).pipe(
      catchError(() => of(null)),
      map(() => {
        this.setToken(null);
      }),
    );
  }

  me(): Observable<AdminUser> {
    return this.get<AdminUser>('me');
  }

  stats(): Observable<HomeStats> {
    return this.get<HomeStats>('home/stats');
  }

  settings(): Observable<SiteSettings> {
    return this.get<SiteSettings>('settings');
  }

  services(): Observable<Service[]> {
    return this.get<Service[]>('services');
  }

  search(term: string): Observable<SearchResult> {
    return this.get<SearchResult>('search', { q: term });
  }

  service(slug: string): Observable<Service> {
    return this.get<Service>(`services/${slug}`);
  }

  process(): Observable<ProcessStep[]> {
    return this.get<ProcessStep[]>('process');
  }

  projects(perPage = 12, featured = false, page?: number): Observable<Paginated<Project>> {
    const params: Record<string, string | number | boolean> = {
      per_page: perPage,
      featured,
    };

    if (page && page > 1) {
      params['page'] = page;
    }

    return this.get<Paginated<Project>>('projects', params);
  }

  project(slug: string): Observable<Project> {
    return this.get<Project>(`projects/${slug}`);
  }

  posts(params: Record<string, string | number> = {}): Observable<Paginated<Post>> {
    return this.get<Paginated<Post>>('posts', params);
  }

  post(slug: string): Observable<Post> {
    return this.get<Post>(`posts/${slug}`);
  }

  categories(): Observable<Category[]> {
    return this.get<Category[]>('categories');
  }

  team(): Observable<TeamMember[]> {
    return this.get<TeamMember[]>('team');
  }

  testimonials(): Observable<Testimonial[]> {
    return this.get<Testimonial[]>('testimonials');
  }

  sendContact(payload: ContactPayload): Observable<ContactResponse> {
    return this.send<ContactResponse>('contact', payload);
  }

  adminServices(): Observable<Service[]> {
    return this.get<Service[]>('admin/services');
  }

  adminServiceSave(service: Partial<Service>): Observable<Service> {
    return service.id
      ? this.put<Service>(`admin/services/${service.id}`, service)
      : this.send<Service>('admin/services', service);
  }

  adminServiceDelete(id: number): Observable<unknown> {
    return this.delete(`admin/services/${id}`);
  }

  adminProjects(): Observable<Project[]> {
    return this.get<Project[]>('admin/projects');
  }

  adminProjectSave(project: Partial<Project>): Observable<Project> {
    return project.id
      ? this.put<Project>(`admin/projects/${project.id}`, project)
      : this.send<Project>('admin/projects', project);
  }

  adminProjectDelete(id: number): Observable<unknown> {
    return this.delete(`admin/projects/${id}`);
  }

  adminPosts(): Observable<Post[]> {
    return this.get<Post[]>('admin/posts');
  }

  adminPostSave(post: Partial<Post>): Observable<Post> {
    return post.id
      ? this.put<Post>(`admin/posts/${post.id}`, post)
      : this.send<Post>('admin/posts', post);
  }

  adminPostDelete(id: number): Observable<unknown> {
    return this.delete(`admin/posts/${id}`);
  }

  adminCategories(): Observable<Category[]> {
    return this.get<Category[]>('admin/categories');
  }

  adminCategorySave(category: Partial<Category>): Observable<Category> {
    return category.id
      ? this.put<Category>(`admin/categories/${category.id}`, category)
      : this.send<Category>('admin/categories', category);
  }

  adminCategoryDelete(id: number): Observable<unknown> {
    return this.delete(`admin/categories/${id}`);
  }

  adminTeam(): Observable<TeamMember[]> {
    return this.get<TeamMember[]>('admin/team');
  }

  adminTeamSave(member: Partial<TeamMember>): Observable<TeamMember> {
    return member.id
      ? this.put<TeamMember>(`admin/team/${member.id}`, member)
      : this.send<TeamMember>('admin/team', member);
  }

  adminTeamDelete(id: number): Observable<unknown> {
    return this.delete(`admin/team/${id}`);
  }

  adminTestimonials(): Observable<Testimonial[]> {
    return this.get<Testimonial[]>('admin/testimonials');
  }

  adminTestimonialSave(item: Partial<Testimonial>): Observable<Testimonial> {
    return item.id
      ? this.put<Testimonial>(`admin/testimonials/${item.id}`, item)
      : this.send<Testimonial>('admin/testimonials', item);
  }

  adminTestimonialDelete(id: number): Observable<unknown> {
    return this.delete(`admin/testimonials/${id}`);
  }

  adminMessages(unreadOnly = false): Observable<ContactMessage[]> {
    return this.get<ContactMessage[]>('admin/messages', unreadOnly ? { unread: true } : {});
  }

  adminUnreadCount(): Observable<{ count: number }> {
    return this.get<{ count: number }>('admin/messages/unread-count');
  }

  adminMessageMarkRead(id: number) {
    return this.patch(`admin/messages/${id}/read`, {});
  }

  adminMessageDelete(id: number) {
    return this.delete(`admin/messages/${id}`);
  }

  adminSettings(): Observable<SiteSettings> {
    return this.get<SiteSettings>('admin/settings');
  }

  adminSettingsUpdate(key: string, value: string) {
    return this.put<SiteSettings>('admin/settings', { key, value });
  }

  adminSettingsBulk(entries: { key: string; value: string }[]) {
    return this.put<SiteSettings>('admin/settings/bulk', { settings: entries });
  }
}