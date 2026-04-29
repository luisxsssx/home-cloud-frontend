# Settings Sidebar Implementation

## NEW FILE: `src/app/components/settings-sidebar/settings-sidebar.component.ts`

```typescript
import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-settings-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './settings-sidebar.component.html',
  styleUrl: './settings-sidebar.component.css'
})
export class SettingsSidebarComponent {
  activeSection = input<'profile' | 'security' | 'storage'>('profile');

  back = output<void>();
  sectionSelected = output<'profile' | 'security' | 'storage'>();

  onBack(): void {
    this.back.emit();
  }

  onSection(section: 'profile' | 'security' | 'storage'): void {
    this.sectionSelected.emit(section);
  }
}
```

## NEW FILE: `src/app/components/settings-sidebar/settings-sidebar.component.html`

```html
<aside class="w-56 bg-white border-r border-gray-100 flex flex-col h-screen">
  <div class="p-3.5 border-b border-gray-100">
    <button
      (click)="onBack()"
      class="w-full flex items-center gap-2.5 px-2.5 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors text-sm"
    >
      <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 19l-7-7 7-7" />
      </svg>
      <span class="text-xs font-medium">Back to drive</span>
    </button>
  </div>

  <nav class="flex-1 p-2.5 overflow-y-auto">
    <ul class="space-y-0.5">
      <li>
        <button
          (click)="onSection('profile')"
          class="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md transition-colors text-sm"
          [class.bg-green-50]="activeSection() === 'profile'"
          [class.text-green-800]="activeSection() === 'profile'"
          [class.text-gray-500]="activeSection() !== 'profile'"
          [class.hover:bg-gray-50]="activeSection() !== 'profile'"
          [class.hover:text-gray-700]="activeSection() !== 'profile'"
        >
          <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span class="text-xs">Profile</span>
        </button>
      </li>
      <li>
        <button
          (click)="onSection('security')"
          class="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md transition-colors text-sm"
          [class.bg-green-50]="activeSection() === 'security'"
          [class.text-green-800]="activeSection() === 'security'"
          [class.text-gray-500]="activeSection() !== 'security'"
          [class.hover:bg-gray-50]="activeSection() !== 'security'"
          [class.hover:text-gray-700]="activeSection() !== 'security'"
        >
          <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span class="text-xs">Security</span>
        </button>
      </li>
      <li>
        <button
          (click)="onSection('storage')"
          class="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md transition-colors text-sm"
          [class.bg-green-50]="activeSection() === 'storage'"
          [class.text-green-800]="activeSection() === 'storage'"
          [class.text-gray-500]="activeSection() !== 'storage'"
          [class.hover:bg-gray-50]="activeSection() !== 'storage'"
          [class.hover:text-gray-700]="activeSection() !== 'storage'"
        >
          <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
          </svg>
          <span class="text-xs">Storage</span>
        </button>
      </li>
    </ul>
  </nav>
</aside>
```

## NEW FILE: `src/app/components/settings-sidebar/settings-sidebar.component.css`

(empty - Tailwind only)

## MODIFY: `src/app/components/settings/settings.component.ts`

Remove:
```typescript
import { SidebarComponent } from '../sidebar/sidebar.component';
sidebarOpen = signal(false);
toggleSidebar(): void { ... }
closeSidebar(): void { ... }
```

Add:
```typescript
import { SettingsSidebarComponent } from '../settings-sidebar/settings-sidebar.component';
```

Update imports in @Component:
```typescript
imports: [CommonModule, FormsModule, SettingsSidebarComponent],
```

Add:
```typescript
goBack(): void {
  this.router.navigate(['/dashboard']);
}
```

Remove:
```typescript
implements OnInit, and the ngOnInit() method with the console.log
```

## MODIFY: `src/app/components/settings/settings.component.html`

Replace the entire layout. Remove:
- The mobile sidebar overlay and drawer (`@if (sidebarOpen())...` block and the mobile `<app-sidebar>` div)
- The desktop `<app-sidebar class="hidden md:flex"></app-sidebar>`
- The header with hamburger button
- The tab pills `<nav class="flex gap-1 bg-white...">` block

New layout:
```html
<div class="min-h-screen flex bg-gray-50">
  <app-settings-sidebar
    [activeSection]="activeSection()"
    (back)="goBack()"
    (sectionSelected)="activeSection.set($event)"
  ></app-settings-sidebar>

  <main class="flex-1 flex flex-col min-w-0">
    <div class="flex-1 p-3 md:p-6 overflow-auto">
      <div class="max-w-2xl mx-auto space-y-4">
        <!-- All the existing content sections stay the same -->
      </div>
    </div>
  </main>
</div>
```
