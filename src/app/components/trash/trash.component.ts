import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-trash',
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  templateUrl: './trash.component.html',
  styleUrl: './trash.component.css'
})
export class TrashComponent implements OnInit {
  authService = inject(AuthService);
  storageService = inject(StorageService);

  user = this.authService.getUser();
  sidebarOpen = signal(false);
  trashItems = this.storageService.trashItems;

  ngOnInit(): void {
  }

  toggleSidebar(): void {
    this.sidebarOpen.update(v => !v);
  }

  closeSidebar(): void {
    this.sidebarOpen.set(false);
  }
}
