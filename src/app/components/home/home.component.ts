import { Component, inject, signal, ViewChild, ElementRef, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { AuthService } from '../../services/auth.service';
import { FileService } from '../../services/file.service';
import { NotificationService } from '../../services/notification.service';
import { FileItemResponse } from '../../models/fileItemResponse';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, SidebarComponent, DatePipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  authService = inject(AuthService);
  fileService = inject(FileService);
  notificationService = inject(NotificationService);

  user = this.authService.getUser();
  sidebarOpen = signal(false);
  uploading = signal(false);
  recentFiles = signal<FileItemResponse[]>([]);
  totalFiles = signal(0);
  totalFolders = signal(0);
  loading = signal(true);

  ngOnInit(): void {
    this.loadRecentFiles();
  }

  loadRecentFiles(): void {
    this.loading.set(true);
    this.fileService.listAllFiles().subscribe({
      next: (files) => {
        const sorted = files.sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        this.recentFiles.set(sorted.slice(0, 10));
        this.totalFiles.set(files.length);
        const folders = new Set(files.filter(f => f.folderName).map(f => f.folderName));
        this.totalFolders.set(folders.size);
        this.loading.set(false);
      },
      error: () => {
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
        this.uploading.set(false);
      },
      error: () => {
        this.notificationService.error('Failed to upload file');
        this.uploading.set(false);
      }
    });
  }
}
