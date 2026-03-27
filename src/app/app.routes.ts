import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { authGuard } from './guards/auth.guard';
import { guestGuard } from './guards/guest.guard';

export const routes: Routes = [
  { 
    path: 'login', 
    component: LoginComponent,
    canActivate: [guestGuard]
  },
  { 
    path: 'register', 
    component: RegisterComponent,
    canActivate: [guestGuard]
  },
  { 
    path: 'recent', 
    loadComponent: () => import('./components/recent/recent.component').then(m => m.RecentComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'starred', 
    loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'trash', 
    loadComponent: () => import('./components/trash/trash.component').then(m => m.TrashComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'my-drive', 
    loadComponent: () => import('./components/my-drive/my-drive.component').then(m => m.MyDriveComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'folder/:folderName', 
    loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent),
    canActivate: [authGuard]
  },
  { 
    path: '', 
    loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent),
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: '' }
];
