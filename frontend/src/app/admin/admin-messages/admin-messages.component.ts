import { Component, inject, signal } from '@angular/core';
import { NgFor, NgIf, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiError, ApiService } from '../../core/api.service';
import { ContactMessage } from '../../core/models';
import { RevealDirective } from '../../shared/reveal/reveal.directive';

@Component({
  selector: 'app-admin-messages',
  standalone: true,
  imports: [NgFor, NgIf, DatePipe, FormsModule, RevealDirective],
  template: `
    <div class="admin-head" appReveal="up">
      <div>
        <h1>Messages</h1>
        <p>Enquiries submitted through the contact form.</p>
      </div>
      <div class="admin-actions">
        <button class="btn btn--ghost btn--sm" [class.btn--dark]="!unreadOnly()" (click)="unreadOnly.set(false); load()">
          All
        </button>
        <button class="btn btn--ghost btn--sm" [class.btn--dark]="unreadOnly()" (click)="unreadOnly.set(true); load()">
          Unread only
        </button>
      </div>
    </div>

    <div class="alert alert--error" *ngIf="error">{{ error }}</div>

    <div class="admin-card" *ngIf="messages().length; else empty" appReveal="up" [appRevealDelay]="120">
      <table class="admin-table">
        <thead>
          <tr>
            <th>From</th>
            <th>Message</th>
            <th>Received</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let item of messages()" [style.background]="item.is_read ? '' : 'var(--blue-50)'">
            <td>
              <strong>{{ item.name }}</strong>
              <span class="badge" *ngIf="!item.is_read">New</span>
              <div style="font-size:0.84rem;color:var(--slate-500)">{{ item.email }}</div>
              <div style="font-size:0.84rem;color:var(--slate-500)" *ngIf="item.phone">{{ item.phone }}</div>
            </td>
            <td style="max-width:420px">
              <strong *ngIf="item.subject">{{ item.subject }}</strong>
              <div style="font-size:0.88rem;color:var(--slate-500);white-space:pre-line">{{ item.message }}</div>
            </td>
            <td style="white-space:nowrap">
              {{ item.created_at | date: 'd M y' }}<br />
              <span style="font-size:0.8rem;color:var(--slate-500)">{{ item.created_at | date: 'H:i' }}</span>
            </td>
            <td>
              <div class="admin-table__actions">
                <a class="btn btn--ghost btn--sm" [href]="'mailto:' + item.email + '?subject=Re: ' + (item.subject || 'Your enquiry')">
                  Reply
                </a>
                <button class="btn btn--ghost btn--sm" *ngIf="!item.is_read" (click)="markRead(item)">Mark read</button>
                <button class="btn btn--ghost btn--sm" (click)="remove(item)">Delete</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <ng-template #empty>
      <div class="admin-card" appReveal="up" [appRevealDelay]="120">
        <div class="empty-state">
          <h3>No messages</h3>
          <p>Nothing has arrived through the contact form yet.</p>
        </div>
      </div>
    </ng-template>
  `,
})
export class AdminMessagesComponent {
  private readonly api = inject(ApiService);

  readonly messages = signal<ContactMessage[]>([]);
  readonly unreadOnly = signal(false);
  error = '';

  constructor() {
    this.load();
  }

  load(): void {
    this.api.adminMessages(this.unreadOnly()).subscribe({
      next: (items) => this.messages.set(items),
      error: (err: ApiError) => (this.error = err.message),
    });
  }

  markRead(item: ContactMessage): void {
    this.api.adminMessageMarkRead(item.id).subscribe({
      next: () => this.load(),
      error: (err: ApiError) => (this.error = err.message),
    });
  }

  remove(item: ContactMessage): void {
    if (!confirm(`Delete the message from ${item.name}?`)) {
      return;
    }

    this.api.adminMessageDelete(item.id).subscribe({
      next: () => this.load(),
      error: (err: ApiError) => (this.error = err.message),
    });
  }
}