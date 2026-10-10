import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DatePipe, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LazyImageDirective } from '../lazy-image/lazy-image.directive';
import { RevealDirective } from '../reveal/reveal.directive';
import { Post } from '../../core/models';

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [RouterLink, DatePipe, NgIf, LazyImageDirective, RevealDirective],
  template: `
    <a class="post" [routerLink]="['/insights', post.slug]">
      <div class="post__media" *ngIf="post.image">
        <img [src]="post.image" [alt]="post.title" loading="lazy" />
      </div>
      <div class="post__body">
        <span class="badge" *ngIf="post.category">{{ post.category.name }}</span>
        <h3>{{ post.title }}</h3>
        <p>{{ post.excerpt }}</p>
        <span class="post__meta">
          <ng-container *ngIf="post.author">{{ post.author.name }}</ng-container>
          <ng-container *ngIf="post.published_at">{{ post.published_at | date: 'd M y' }}</ng-container>
        </span>
      </div>
    </a>
  `,
  styleUrl: './post-card.component.scss',
})
export class PostCardComponent {
  @Input({ required: true }) post!: Post;
  @Output() readonly selected = new EventEmitter<Post>();
}