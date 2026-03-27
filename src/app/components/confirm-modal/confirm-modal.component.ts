import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" (click)="cancel.emit()"></div>
      <div class="relative bg-white rounded-lg shadow-xl w-full max-w-sm p-5 animate-scale-in">
        <h3 class="text-sm font-medium text-gray-800 mb-2">{{ title() }}</h3>
        <p class="text-xs text-gray-500 mb-5">{{ message() }}</p>
        <div class="flex gap-2 justify-end">
          <button 
            (click)="cancel.emit()"
            class="px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button 
            (click)="confirm.emit()"
            class="px-3 py-1.5 text-xs bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            {{ confirmText() }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes scale-in {
      from {
        transform: scale(0.95);
        opacity: 0;
      }
      to {
        transform: scale(1);
        opacity: 1;
      }
    }
    .animate-scale-in {
      animation: scale-in 0.2s ease-out;
    }
  `]
})
export class ConfirmModalComponent {
  title = input<string>('Confirm');
  message = input<string>('Are you sure?');
  confirmText = input<string>('Confirm');
  
  confirm = output<void>();
  cancel = output<void>();
}
