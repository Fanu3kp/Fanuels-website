import { Routes } from '@angular/router';
import { adminGuard, guestGuard } from './core/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent),
    title: 'Otuya Global Business & Technology Company',
  },
  {
    path: 'services',
    loadComponent: () => import('./pages/services/services.component').then((m) => m.ServicesComponent),
    title: 'Services | Otuya Global Business & Technology Company',
  },
  {
    path: 'products',
    loadComponent: () => import('./pages/products/products.component').then((m) => m.ProductsComponent),
    title: 'Products | Otuya Global Business & Technology Company',
  },
  {
    path: 'careers',
    loadComponent: () => import('./pages/careers/careers.component').then((m) => m.CareersComponent),
    title: 'Careers | Otuya Global Business & Technology Company',
  },
  {
    path: 'privacy',
    loadComponent: () => import('./pages/privacy/privacy.component').then((m) => m.PrivacyComponent),
    title: 'Privacy Policy | Otuya Global Business & Technology Company',
  },
  {
    path: 'terms',
    loadComponent: () => import('./pages/terms/terms.component').then((m) => m.TermsComponent),
    title: 'Terms of Service | Otuya Global Business & Technology Company',
  },
  {
    path: 'cookies',
    loadComponent: () => import('./pages/cookies/cookies.component').then((m) => m.CookiesComponent),
    title: 'Cookie Policy | Otuya Global Business & Technology Company',
  },
  {
    path: 'faq',
    loadComponent: () => import('./pages/faq/faq.component').then((m) => m.FAQComponent),
    title: 'FAQ | Otuya Global Business & Technology Company',
  },
  {
    path: 'services/:slug',
    loadComponent: () => import('./pages/service-detail/service-detail.component').then((m) => m.ServiceDetailComponent),
  },
  {
    path: 'business',
    loadComponent: () => import('./pages/branches/branches.component').then((m) => m.BranchesComponent),
    title: 'Our Business Units | Otuya Global Technology & Business Group',
  },
  {
    path: 'structure',
    loadComponent: () => import('./pages/structure/structure.component').then((m) => m.StructureComponent),
    title: 'Our Structure | Otuya Global Technology & Business Group',
  },
  {
    path: 'contact',
    loadComponent: () => import('./pages/contact/contact.component').then((m) => m.ContactComponent),
    title: 'Contact | Otuya Global Business & Technology Company',
  },
  {
    path: 'search',
    loadComponent: () => import('./pages/search/search.component').then((m) => m.SearchComponent),
    title: 'Search | Otuya Global Business & Technology Company',
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about.component').then((m) => m.AboutComponent),
    title: 'About Us | Otuya Global Business & Technology Company',
  },
  {
    path: 'insights',
    loadComponent: () => import('./pages/blog/blog.component').then((m) => m.BlogComponent),
    title: 'Insights | Otuya Global Business & Technology Company',
  },
  {
    path: 'insights/:slug',
    loadComponent: () => import('./pages/post-detail/post-detail.component').then((m) => m.PostDetailComponent),
  },
  {
    path: 'projects',
    loadComponent: () => import('./pages/projects/projects.component').then((m) => m.ProjectsComponent),
    title: 'Projects | Otuya Global Business & Technology Company',
  },
{
    path: 'insights/:slug',
    loadComponent: () => import('./pages/post-detail/post-detail.component').then((m) => m.PostDetailComponent),
  },
  {
    path: 'lab',
    loadComponent: () => import('./pages/lab/lab.component').then((m) => m.LabComponent),
    title: 'Lab | Otuya Global - Live Visual Synthesis',
  },
  {
    path: 'admin/login',
    canActivate: [guestGuard],
    loadComponent: () => import('./admin/admin-login/admin-login.component').then((m) => m.AdminLoginComponent),
    title: 'Sign in | Otuya Global Business & Technology Company Admin',
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () => import('./admin/admin-layout/admin-layout.component').then((m) => m.AdminLayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./admin/admin-dashboard/admin-dashboard.component').then((m) => m.AdminDashboardComponent),
      },
      {
        path: 'services',
        loadComponent: () => import('./admin/admin-services/admin-services.component').then((m) => m.AdminServicesComponent),
      },
      {
        path: 'projects',
        loadComponent: () => import('./admin/admin-projects/admin-projects.component').then((m) => m.AdminProjectsComponent),
      },
      {
        path: 'posts',
        loadComponent: () => import('./admin/admin-posts/admin-posts.component').then((m) => m.AdminPostsComponent),
      },
      {
        path: 'categories',
        loadComponent: () => import('./admin/admin-categories/admin-categories.component').then((m) => m.AdminCategoriesComponent),
      },
      {
        path: 'team',
        loadComponent: () => import('./admin/admin-team/admin-team.component').then((m) => m.AdminTeamComponent),
      },
      {
        path: 'testimonials',
        loadComponent: () => import('./admin/admin-testimonials/admin-testimonials.component').then((m) => m.AdminTestimonialsComponent),
      },
      {
        path: 'messages',
        loadComponent: () => import('./admin/admin-messages/admin-messages.component').then((m) => m.AdminMessagesComponent),
      },
      {
        path: 'settings',
        loadComponent: () => import('./admin/admin-settings/admin-settings.component').then((m) => m.AdminSettingsComponent),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];