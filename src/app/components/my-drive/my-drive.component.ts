import { Component, inject, signal, ViewChild, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { AuthService } from '../../services/auth.service';
import { FileService } from '../../services/file.service';
import { NotificationService } from '../../services/notification.service';
import { FolderResponse } from '../../models/folderResponse';

@Component({
  selector: 'app-my-drive',
  standalone: true,
  imports: [CommonModule, SidebarComponent, ConfirmModalComponent],
  templateUrl: './my-drive.component.html',
  styleUrl: './my-drive.component.css'
})
export class MyDriveComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  authService = inject(AuthService);
  fileService = inject(FileService);
  notificationService = inject(NotificationService);

  user = this.authService.getUser();
  sidebarOpen = signal(false);
  files = signal<FolderResponse[]>([]);
  loading = signal(false);
  uploading = signal(false);
  fileToDelete = signal<string | null>(null);

  ngOnInit(): void {
    this.loadFiles();
  }

  loadFiles(): void {
    this.loading.set(true);
    this.fileService.listRoot('').subscribe({
      next: (response) => {
        this.files.set(response);
        this.loading.set(false);
      },
      error: (error) => {
        this.notificationService.error('Failed to load files');
        this.loading.set(false);
      }
    });
  }

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
        this.loadFiles();
        this.uploading.set(false);
      },
      error: (error) => {
        this.notificationService.error('Failed to upload file');
        this.uploading.set(false);
      }
    });
  }

  deleteFile(fileName: string): void {
    this.fileToDelete.set(fileName);
  }

  confirmDelete(): void {
    const fileName = this.fileToDelete();
    if (!fileName) return;

    this.fileService.deleteFile(fileName).subscribe({
      next: () => {
        this.notificationService.success('File deleted successfully');
        this.loadFiles();
      },
      error: () => {
        this.notificationService.error('Failed to delete file');
      }
    });
    this.fileToDelete.set(null);
  }

  cancelDelete(): void {
    this.fileToDelete.set(null);
  }
}
