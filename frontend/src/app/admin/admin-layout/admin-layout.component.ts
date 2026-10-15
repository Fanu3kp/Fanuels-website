import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NgIf],
  styleUrls: ['../../../styles-admin.scss'],
  template: `
    <div class="admin-layout">
      <aside class="admin-side">
        <a routerLink="/" class="admin-side__brand">
          <span class="admin-side__mark">FG</span>
          <strong>Otuya Global</strong>
        </a>

        <div class="admin-side__group">Overview</div>
        <a routerLink="/admin/dashboard" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }" class="nav-item">
          Dashboard
        </a>

        <div class="admin-side__group">Content</div>
        <a routerLink="/admin/services" routerLinkActive="active" class="nav-item">Services</a>
        <a routerLink="/admin/projects" routerLinkActive="active" class="nav-item">Projects</a>
        <a routerLink="/admin/posts" routerLinkActive="active" class="nav-item">Blog posts</a>
        <a routerLink="/admin/categories" routerLinkActive="active" class="nav-item">Categories</a>

        <div class="admin-side__group">Company</div>
        <a routerLink="/admin/team" routerLinkActive="active" class="nav-item">Team</a>
        <a routerLink="/admin/testimonials" routerLinkActive="active" class="nav-item">Testimonials</a>
        <a routerLink="/admin/messages" routerLinkActive="active" class="nav-item">Messages</a>
        <a routerLink="/admin/settings" routerLinkActive="active" class="nav-item">Settings</a>

        <div class="admin-side__foot">
          <div *ngIf="auth.user() as user" style="margin-bottom:12px">
            <strong style="color:#fff;display:block">{{ user.name }}</strong>
            <span style="font-size:0.8rem">{{ user.email }}</span>
          </div>
          <a routerLink="/">View site</a> &middot;
          <a href="javascript:void(0)" (click)="auth.logout()">Sign out</a>
        </div>
      </aside>

      <main class="admin-main">
        <router-outlet />
      </main>
    </div>
  `,
})
export class AdminLayoutComponent {
  readonly auth = inject(AuthService);
}