import { Component, inject, signal, output, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FileService } from '../../services/file.service';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { FolderDataBase } from '../../models/folderDataBase.model';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  expandable?: boolean;
}

interface FolderNode {
  name: string;
  fullPath: string;
  children: FolderNode[];
  expanded: boolean;
}

interface FlatFolderItem {
  name: string;
  fullPath: string;
  depth: number;
  hasChildren: boolean;
  expanded: boolean;
  node: FolderNode;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, ConfirmModalComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {
  private router = inject(Router);
  authService = inject(AuthService);
  fileService = inject(FileService);
  closeSidebar = output<void>();
  addMenuOpen = output<void>();
  folderCreateRequested = output<void>();
  showLogoutConfirm = signal(false);
  showAccountPopup = signal(false);
  filesExpanded = signal(false);
  myDriveExpanded = signal(false);
  showAddMenu = signal(false);
  folderToDelete = signal<string | null>(null);
  
  user = this.authService.getUser();
  folderTree = signal<FolderNode[]>([]);
  flatFolders = signal<FlatFolderItem[]>([]);

  navItems: NavItem[] = [
    { label: 'Recent', icon: 'clock', route: '/recent' },
    { label: 'Trash', icon: 'trash', route: '/trash' },
  ];

  ngOnInit(): void {
    if (!this.fileService.bucketInfoLoaded()) {
      this.fileService.loadBucketInfo().subscribe();
    }
    this.loadFolders();
  }

  loadFolders(): void {
    this.fileService.listAllFolders().subscribe({
      next: (folders) => {
        const tree = this.buildFolderTree(folders.map(f => f.folder_name));
        this.folderTree.set(tree);
        this.flatFolders.set(this.flattenTree(tree));
      }
    });
  }

  private flattenTree(nodes: FolderNode[], depth = 0): FlatFolderItem[] {
    const result: FlatFolderItem[] = [];
    for (const node of nodes) {
      result.push({ name: node.name, fullPath: node.fullPath, depth, hasChildren: node.children.length > 0, expanded: node.expanded, node });
      if (node.expanded && node.children.length > 0) {
        result.push(...this.flattenTree(node.children, depth + 1));
      }
    }
    return result;
  }

  private buildFolderTree(folderNames: string[]): FolderNode[] {
    const root: FolderNode[] = [];

    for (const path of folderNames) {
      const parts = path.split('/');
      let current = root;

      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        let node = current.find(n => n.name === part);

        if (!node) {
          node = {
            name: part,
            fullPath: parts.slice(0, i + 1).join('/'),
            children: [],
            expanded: false,
          };
          current.push(node);
        }

        if (i < parts.length - 1) {
          current = node.children;
        }
      }
    }

    return root;
  }

  toggleFolderNode(node: FolderNode): void {
    node.expanded = !node.expanded;
    this.folderTree.set([...this.folderTree()]);
    this.flatFolders.set(this.flattenTree(this.folderTree()));
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
    this.showAccountPopup.set(false);
    this.showLogoutConfirm.set(true);
  }

  toggleAccountPopup(): void {
    this.showAccountPopup.update(v => !v);
  }

  goToSettings(): void {
    this.showAccountPopup.set(false);
    this.router.navigate(['/settings']);
  }

  closeAccountPopup(): void {
    this.showAccountPopup.set(false);
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

  toggleAddMenu(event: Event): void {
    event.stopPropagation();
    this.showAddMenu.update(v => !v);
  }

  closeAddMenu(): void {
    this.showAddMenu.set(false);
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.closeAddMenu();
    this.closeAccountPopup();
  }
}
