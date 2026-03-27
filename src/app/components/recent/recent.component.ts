import { Component, inject, signal, ViewChild, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-recent',
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  templateUrl: './recent.component.html',
  styleUrl: './recent.component.css'
})
export class RecentComponent implements OnInit {
  authService = inject(AuthService);
  storageService = inject(StorageService);

  user = this.authService.getUser();
  sidebarOpen = signal(false);
  recentItems = this.storageService.recentItems;

  ngOnInit(): void {
  }

  toggleSidebar(): void {
    this.sidebarOpen.update(v => !v);
  }

  closeSidebar(): void {
    this.sidebarOpen.set(false);
  }
}
