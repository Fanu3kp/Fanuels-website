import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

/**
 * Lets any part of the app (e.g. the footer) reopen the cookie
 * preference dialog, so cookie controls are never unreachable
 * after the banner has been dismissed.
 */
@Injectable({ providedIn: 'root' })
export class CookieConsentService {
  private readonly openSettingsSubject = new Subject<void>();
  readonly openSettings$ = this.openSettingsSubject.asObservable();

  requestSettings(): void {
    this.openSettingsSubject.next();
  }
}
