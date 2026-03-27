import { Component, inject, signal, output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FileService } from '../../services/file.service';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';

interface Folder {
  name: string;
}

interface NavItem {
  label: string;
  icon: string;
  route: string;
  expandable?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, ConfirmModalComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {
  authService = inject(AuthService);
  fileService = inject(FileService);
  closeSidebar = output<void>();
  showLogoutConfirm = signal(false);
  filesExpanded = signal(false);
  myDriveExpanded = signal(false);
  folderToDelete = signal<string | null>(null);
  
  user = this.authService.getUser();
  folders: Folder[] = [];

  navItems: NavItem[] = [
    { label: 'Recent', icon: 'clock', route: '/recent' },
    { label: 'Trash', icon: 'trash', route: '/trash' },
  ];

  ngOnInit(): void {
    this.loadFolders();
  }

  loadFolders(): void {
    this.fileService.listRoot('').subscribe({
      next: (response) => {
        this.folders = response
          .filter((item: any) => item.type === 'folder')
          .map((item: any) => ({ name: item.name }));
      }
    });
  }

  toggleFilesSection(): void {
    this.filesExpanded.set(!this.filesExpanded());
  }

  toggleMyDrive(): void {
    this.myDriveExpanded.set(!this.myDriveExpanded());
  }

  onMyDriveClick(event: MouseEvent): void {
    if (event.detail === 2) {
      this.toggleMyDrive();
    }
  }

  onMyDriveIconClick(event: MouseEvent): void {
    event.stopPropagation();
    this.toggleMyDrive();
  }

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

  deleteFolder(name: string): void {
    this.folderToDelete.set(name);
  }

  confirmDeleteFolder(): void {
    const folderName = this.folderToDelete();
    if (!folderName) return;

    this.fileService.deleteFolder(folderName).subscribe({
      next: () => {
        this.loadFolders();
      },
      error: () => {
        console.error('Failed to delete folder');
      }
    });
    this.folderToDelete.set(null);
  }

  cancelDeleteFolder(): void {
    this.folderToDelete.set(null);
  }
}
