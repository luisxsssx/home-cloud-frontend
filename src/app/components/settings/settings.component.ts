import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SettingsSidebarComponent } from '../settings-sidebar/settings-sidebar.component';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, SettingsSidebarComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {
  private router = inject(Router);
  authService = inject(AuthService);
  notificationService = inject(NotificationService);

  user = this.authService.getUser();

  // Coment

  editProfile = signal(false);
  editUsername = signal(this.user?.username || '');
  editEmail = signal(this.user?.email || '');

  showPassword = signal(false);
  currentPassword = signal('');
  newPassword = signal('');
  confirmPassword = signal('');

  showDeleteAccount = signal(false);
  deleteConfirmText = '';

  savingProfile = signal(false);
  savingPassword = signal(false);

  activeSection = signal<'profile' | 'security' | 'storage'>('profile');

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  startEditProfile(): void {
    this.editUsername.set(this.user?.username || '');
    this.editEmail.set(this.user?.email || '');
    this.editProfile.set(true);
  }

  cancelEditProfile(): void {
    this.editProfile.set(false);
  }

  saveProfile(): void {
    const username = this.editUsername().trim();
    const email = this.editEmail().trim();

    if (!username) {
      this.notificationService.error('Username cannot be empty');
      return;
    }

    if (email && !this.isValidEmail(email)) {
      this.notificationService.error('Please enter a valid email address');
      return;
    }

    this.savingProfile.set(true);
    this.authService.updateUser({ username, email });
    this.user = this.authService.getUser();
    this.editProfile.set(false);
    this.savingProfile.set(false);
    this.notificationService.success('Profile updated successfully');
  }

  changePassword(): void {
    const current = this.currentPassword();
    const newPass = this.newPassword();
    const confirm = this.confirmPassword();

    if (!current || !newPass || !confirm) {
      this.notificationService.error('Please fill in all password fields');
      return;
    }

    if (newPass.length < 6) {
      this.notificationService.error('Password must be at least 6 characters');
      return;
    }

    if (newPass !== confirm) {
      this.notificationService.error('Passwords do not match');
      return;
    }

    this.savingPassword.set(true);
    this.notificationService.success('Password changed successfully');
    this.currentPassword.set('');
    this.newPassword.set('');
    this.confirmPassword.set('');
    this.showPassword.set(false);
    this.savingPassword.set(false);
  }

  cancelPasswordChange(): void {
    this.showPassword.set(false);
    this.currentPassword.set('');
    this.newPassword.set('');
    this.confirmPassword.set('');
  }

  confirmDeleteAccount(): void {
    if (this.deleteConfirmText !== this.user?.username) {
      this.notificationService.error('Username does not match');
      return;
    }
    this.authService.logout();
    this.notificationService.success('Account deleted');
  }

  cancelDeleteAccount(): void {
    this.showDeleteAccount.set(false);
    this.deleteConfirmText = '';
  }

  getInitials(): string {
    const name = this.user?.username || 'U';
    return name[0].toUpperCase();
  }

  getAvatarColor(): string {
    const colors = [
      'bg-green-700',
      'bg-blue-600',
      'bg-purple-600',
      'bg-orange-500',
      'bg-pink-600',
      'bg-teal-600',
    ];
    const index = (this.user?.username || '').charCodeAt(0) % colors.length;
    return colors[index];
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  formatCreatedAt(): string {
    if (!this.user?.created_at) return 'Unknown';
    return new Date(this.user.created_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
