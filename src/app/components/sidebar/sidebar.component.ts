import { Component, inject, signal, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, ConfirmModalComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  authService = inject(AuthService);
  closeSidebar = output<void>();
  showLogoutConfirm = signal(false);
  
  user = this.authService.getUser();

  navItems = [
    { label: 'My Files', icon: 'folder', route: '/' },
    { label: 'Recent', icon: 'clock', route: '/recent' },
    { label: 'Starred', icon: 'star', route: '/starred' },
    { label: 'Trash', icon: 'trash', route: '/trash' },
  ];

  onNavClick(): void {
    this.closeSidebar.emit();
  }

  confirmLogout(): void {
    this.showLogoutConfirm.set(true);
  }

  onLogoutConfirm(): void {
    this.showLogoutConfirm.set(false);
    this.authService.logout();
  }

  onLogoutCancel(): void {
    this.showLogoutConfirm.set(false);
  }
}
