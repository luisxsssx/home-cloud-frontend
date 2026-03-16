import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed bottom-4 left-4 z-50 flex flex-col gap-2">
      @for (notification of notificationService.notifications$(); track notification.id) {
        <div 
          class="flex items-center gap-3 px-3.5 py-2.5 rounded-md shadow-lg min-w-[280px] max-w-sm animate-slide-in"
          [class.bg-green-800]="notification.type === 'success'"
          [class.bg-red-700]="notification.type === 'error'"
          [class.bg-gray-800]="notification.type === 'info'"
        >
          @switch (notification.type) {
            @case ('success') {
              <svg class="w-4 h-4 text-green-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            }
            @case ('error') {
              <svg class="w-4 h-4 text-red-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            }
            @case ('info') {
              <svg class="w-4 h-4 text-gray-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          }
          <span class="text-xs text-white flex-1">{{ notification.message }}</span>
          <button 
            (click)="notificationService.dismiss(notification.id)"
            class="text-white/60 hover:text-white shrink-0"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    @keyframes slide-in {
      from {
        transform: translateX(-100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    .animate-slide-in {
      animation: slide-in 0.3s ease-out;
    }
  `]
})
export class NotificationComponent {
  notificationService = inject(NotificationService);
}
