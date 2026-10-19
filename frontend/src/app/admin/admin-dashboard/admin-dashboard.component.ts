import { Component, inject } from '@angular/core';
import { NgFor, NgIf, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, forkJoin, of } from 'rxjs';
import { ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { ContactMessage } from '../../core/models';
import { RevealDirective } from '../../shared/reveal/reveal.directive';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [NgIf, NgFor, DatePipe, RouterLink, RevealDirective],
  template: `
    <div class="admin-head" appReveal="up">
      <div>
        <h1>Dashboard</h1>
        <p>Content overview and recent activity.</p>
      </div>
      <div class="admin-actions">
        <a routerLink="/admin/messages" class="btn btn--dark btn--sm">View messages</a>
      </div>
    </div>

    <div class="admin-stats">
      <div class="stat" appReveal="scale" [appRevealDelay]="0">
        <strong>{{ counts().services }}</strong>
        <span>Services</span>
      </div>
      <div class="stat" appReveal="scale" [appRevealDelay]="60">
        <strong>{{ counts().projects }}</strong>
        <span>Projects</span>
      </div>
      <div class="stat" appReveal="scale" [appRevealDelay]="120">
        <strong>{{ counts().posts }}</strong>
        <span>Posts</span>
      </div>
      <div class="stat" appReveal="scale" [appRevealDelay]="180">
        <strong>{{ counts().team }}</strong>
        <span>Team members</span>
      </div>
      <div class="stat" appReveal="scale" [appRevealDelay]="240">
        <strong>{{ counts().testimonials }}</strong>
        <span>Testimonials</span>
      </div>
      <div class="stat" appReveal="scale" [appRevealDelay]="300">
        <strong>{{ counts().unreadMessages }}</strong>
        <span>Unread messages</span>
      </div>
    </div>

    <div class="admin-card" appReveal="up" [appRevealDelay]="160">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Recent messages</th>
            <th>From</th>
            <th>Received</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let message of recentMessages()">
            <td>
              <strong>{{ message.subject || 'No subject' }}</strong>
              <div style="font-size:0.85rem;color:var(--slate-500)">{{ preview(message.message) }}</div>
            </td>
            <td>
              {{ message.name }}
              <div style="font-size:0.85rem;color:var(--slate-500)">{{ message.email }}</div>
            </td>
            <td style="white-space:nowrap">{{ message.created_at | date: 'd M, H:i' }}</td>
            <td style="text-align:right">
              <span class="badge" *ngIf="!message.is_read">New</span>
            </td>
          </tr>
          <tr *ngIf="!recentMessages().length">
            <td colspan="4" style="text-align:center;color:var(--slate-500);padding:40px">
              No messages yet.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
})
export class AdminDashboardComponent {
  private readonly api = inject(ApiService);
  readonly auth = inject(AuthService);

  private readonly data = toSignal(
    forkJoin({
      services: this.api.adminServices().pipe(catchError(() => of([]))),
      projects: this.api.adminProjects().pipe(catchError(() => of([]))),
      posts: this.api.adminPosts().pipe(catchError(() => of([]))),
      team: this.api.adminTeam().pipe(catchError(() => of([]))),
      testimonials: this.api.adminTestimonials().pipe(catchError(() => of([]))),
      unread: this.api.adminUnreadCount().pipe(catchError(() => of({ count: 0 }))),
      messages: this.api.adminMessages().pipe(catchError(() => of([]))),
    }),
    { initialValue: null },
  );

  readonly counts = () => ({
    services: this.data()?.services.length ?? 0,
    projects: this.data()?.projects.length ?? 0,
    posts: this.data()?.posts.length ?? 0,
    team: this.data()?.team.length ?? 0,
    testimonials: this.data()?.testimonials.length ?? 0,
    unreadMessages: this.data()?.unread.count ?? 0,
  });

  readonly recentMessages = () => (this.data()?.messages as ContactMessage[] | undefined ?? []).slice(0, 8);

  preview(message: string): string {
    return message.length > 90 ? `${message.slice(0, 90)}...` : message;
  }
}