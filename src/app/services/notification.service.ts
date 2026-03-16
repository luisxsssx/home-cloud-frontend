import { Injectable, signal } from '@angular/core';

export interface Notification {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications = signal<Notification[]>([]);
  private nextId = 0;

  get notifications$() {
    return this.notifications;
  }

  show(message: string, type: 'success' | 'error' | 'info' = 'info', duration = 4000): void {
    const id = this.nextId++;
    this.notifications.update(n => [...n, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => this.dismiss(id), duration);
    }
  }

  success(message: string): void {
    this.show(message, 'success');
  }

  error(message: string): void {
    this.show(message, 'error', 5000);
  }

  dismiss(id: number): void {
    this.notifications.update(n => n.filter(notif => notif.id !== id));
  }
}
