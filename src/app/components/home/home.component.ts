import { Component, inject, signal, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { AuthService } from '../../services/auth.service';
import { FileService } from '../../services/file.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  authService = inject(AuthService);
  fileService = inject(FileService);
  notificationService = inject(NotificationService);

  user = this.authService.getUser();
  sidebarOpen = signal(false);
  uploading = signal(false);

  toggleSidebar(): void {
    this.sidebarOpen.update(v => !v);
  }

  closeSidebar(): void {
    this.sidebarOpen.set(false);
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.uploadFile(input.files[0]);
      input.value = '';
    }
  }

  uploadFile(file: File): void {
    this.uploading.set(true);
    this.fileService.uploadFile(file, null).subscribe({
      next: () => {
        this.notificationService.success('File uploaded successfully');
        this.uploading.set(false);
      },
      error: () => {
        this.notificationService.error('Failed to upload file');
        this.uploading.set(false);
      }
    });
  }
}
