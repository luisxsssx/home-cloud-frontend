import { Component, inject, signal, ViewChild, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
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

  private route = inject(ActivatedRoute);
  authService = inject(AuthService);
  fileService = inject(FileService);
  notificationService = inject(NotificationService);

  user = this.authService.getUser();
  sidebarOpen = signal(false);
  files = signal<FolderResponse[]>([]);
  allFiles = signal<FolderResponse[]>([]);
  loading = signal(true);
  uploading = signal(false);
  currentFolder = signal<string | null>(null);
  searchQuery = signal('');
  itemToDelete = signal<{name: string; type: 'file' | 'folder'} | null>(null);
  itemToRename = signal<{name: string; type: 'file' | 'folder'} | null>(null);
  showCreateFolderModal = signal(false);
  openMenuFor = signal<string | null>(null);

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const folderName = params.get('folderName');
      this.currentFolder.set(folderName);
      this.loadFiles(folderName);
    });
  }

  loadFiles(folderName: string | null): void {
    this.loading.set(true);
    this.fileService.listRoot(folderName || '').subscribe({
      next: (response) => {
        this.allFiles.set(response);
        this.applySearch();
        this.loading.set(false);
      },
      error: (error) => {
        this.notificationService.error('Failed to load files');
        this.loading.set(false);
      }
    });
  }

  applySearch(): void {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) {
      this.files.set(this.allFiles());
    } else {
      this.files.set(
        this.allFiles().filter(file => 
          file.name.toLowerCase().includes(query)
        )
      );
    }
  }

  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
    this.applySearch();
  }

  clearSearch(): void {
    this.searchQuery.set('');
    this.applySearch();
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
    this.fileService.uploadFile(file, this.currentFolder()).subscribe({
      next: () => {
        this.notificationService.success('File uploaded successfully');
        this.loadFiles(this.currentFolder());
        this.uploading.set(false);
      },
      error: (error) => {
        this.notificationService.error('Failed to upload file');
        this.uploading.set(false);
      }
    });
  }

  deleteItem(file: FolderResponse): void {
    const type = file.name.endsWith('/') ? 'folder' : 'file';
    this.itemToDelete.set({ name: file.name, type });
  }

  confirmDelete(): void {
    const item = this.itemToDelete();
    if (!item) return;

    const deleteCall = item.type === 'folder'
      ? this.fileService.deleteFolder(item.name)
      : this.fileService.deleteFile(item.name);

    deleteCall.subscribe({
      next: () => {
        this.notificationService.success(`${item.type === 'folder' ? 'Folder' : 'File'} deleted successfully`);
        this.loadFiles(this.currentFolder());
      },
      error: () => {
        this.notificationService.error(`Failed to delete ${item.type}`);
      }
    });
    this.itemToDelete.set(null);
  }

  cancelDelete(): void {
    this.itemToDelete.set(null);
  }

  renameItem(file: FolderResponse): void {
    const type = file.name.endsWith('/') ? 'folder' : 'file';
    this.itemToRename.set({ name: file.name, type });
  }

  confirmRename(newName: string | void): void {
    const item = this.itemToRename();
    if (!item || !newName || !newName.trim()) {
      this.itemToRename.set(null);
      return;
    }

    const trimmedName = newName.trim();
    const request = {
      old_file_name: item.name,
      new_file_name: trimmedName,
      itemType: (item.type === 'folder' ? 'FOLDER' : 'FILE') as 'FOLDER' | 'FILE'
    };

    this.fileService.renameItem(request).subscribe({
      next: () => {
        this.notificationService.success(`${item.type === 'folder' ? 'Folder' : 'File'} renamed successfully`);
        this.loadFiles(this.currentFolder());
      },
      error: () => {
        this.notificationService.error(`Failed to rename ${item.type}`);
      }
    });
    this.itemToRename.set(null);
  }

  cancelRename(): void {
    this.itemToRename.set(null);
  }

  openCreateFolderModal(): void {
    this.showCreateFolderModal.set(true);
  }

  confirmCreateFolder(folderName: string | void): void {
    if (!folderName || !folderName.trim()) {
      this.showCreateFolderModal.set(false);
      return;
    }

    const name = folderName.trim();
    this.fileService.createFolder(name).subscribe({
      next: () => {
        this.notificationService.success('Folder created successfully');
        this.loadFiles(this.currentFolder());
      },
      error: () => {
        this.notificationService.error('Failed to create folder');
      }
    });
    this.showCreateFolderModal.set(false);
  }

  cancelCreateFolder(): void {
    this.showCreateFolderModal.set(false);
  }

  toggleMenu(fileName: string, event: Event): void {
    event.stopPropagation();
    if (this.openMenuFor() === fileName) {
      this.openMenuFor.set(null);
    } else {
      this.openMenuFor.set(fileName);
    }
  }

  closeMenu(): void {
    this.openMenuFor.set(null);
  }

  downloadFile(file: FolderResponse): void {
    this.notificationService.success(`Downloading "${file.name}"...`);
    this.fileService.downloadFile(file.name).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        a.click();
        window.URL.revokeObjectURL(url);
        this.closeMenu();
      },
      error: () => {
        this.notificationService.error('Failed to download file');
      }
    });
  }
}
