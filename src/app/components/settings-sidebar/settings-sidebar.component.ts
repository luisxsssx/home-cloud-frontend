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
