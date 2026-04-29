import { Component, input, output, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-account-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" (click)="close.emit()"></div>
      <div class="relative bg-white rounded-lg shadow-xl w-full max-w-sm p-5 animate-scale-in">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-sm font-medium text-gray-800">Account Information</h3>
          <button (click)="close.emit()" class="p-1 text-gray-400 hover:text-gray-600 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        @if (!isEditing()) {
          <div class="flex flex-col items-center mb-4">
            <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
              <span class="text-xl font-medium text-gray-500">{{ user()?.username?.[0]?.toUpperCase() || 'U' }}</span>
            </div>
            <h4 class="text-base font-medium text-gray-800">{{ user()?.username }}</h4>
          </div>

          <div class="space-y-3">
            <div class="p-3 bg-gray-50 rounded-md">
              <p class="text-xs text-gray-400 mb-1">Email</p>
              <p class="text-sm text-gray-700">{{ user()?.email }}</p>
            </div>
            <div class="p-3 bg-gray-50 rounded-md">
              <p class="text-xs text-gray-400 mb-1">Username</p>
              <p class="text-sm text-gray-700">{{ user()?.username }}</p>
            </div>
          </div>

          <div class="flex gap-2 justify-end mt-4">
            <button 
              (click)="startEdit()"
              class="px-3 py-1.5 text-xs bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Edit
            </button>
          </div>
        } @else {
          <div class="flex flex-col items-center mb-4">
            <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
              <span class="text-xl font-medium text-gray-500">{{ editUsername[0]?.toUpperCase() || 'U' }}</span>
            </div>
          </div>

          <div class="space-y-3">
            <div>
              <p class="text-xs text-gray-400 mb-1">Email</p>
              <input
                type="email"
                [(ngModel)]="editEmail"
                class="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-200"
                placeholder="Email"
              />
            </div>
            <div>
              <p class="text-xs text-gray-400 mb-1">Username</p>
              <input
                type="text"
                [(ngModel)]="editUsername"
                (ngModelChange)="onUsernameChange($event)"
                class="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-200"
                placeholder="Username"
              />
            </div>
          </div>

          <div class="flex gap-2 justify-end mt-4">
            <button 
              (click)="cancelEdit()"
              class="px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button 
              (click)="saveChanges()"
              class="px-3 py-1.5 text-xs bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Save
            </button>
          </div>
        }
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
export class AccountModalComponent implements OnInit {
  user = input<{ username?: string; email?: string } | null>(null);
  editMode = input<boolean>(false);
  
  close = output<{ username?: string; email?: string } | void>();
  
  isEditing = signal(false);
  editUsername = '';
  editEmail = '';
  
  ngOnInit(): void {
    if (this.editMode()) {
      this.startEdit();
    }
  }
  
  startEdit(): void {
    this.editUsername = this.user()?.username || '';
    this.editEmail = this.user()?.email || '';
    this.isEditing.set(true);
  }
  
  cancelEdit(): void {
    this.isEditing.set(false);
    this.close.emit();
  }
  
  onUsernameChange(value: string): void {
    this.editUsername = value;
  }
  
  saveChanges(): void {
    this.close.emit({
      username: this.editUsername,
      email: this.editEmail
    });
    this.isEditing.set(false);
  }
}