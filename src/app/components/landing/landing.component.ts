import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {
  features = [
    {
      icon: 'cloud',
      title: 'Cloud Storage',
      description: 'Store your files securely in the cloud and access them from anywhere.'
    },
    {
      icon: 'folder',
      title: 'Organize Files',
      description: 'Create folders and organize your files the way you want.'
    },
    {
      icon: 'star',
      title: 'Starred Files',
      description: 'Mark important files as starred for quick access.'
    },
    {
      icon: 'clock',
      title: 'Recent Files',
      description: 'Quickly find your recently accessed files and folders.'
    },
    {
      icon: 'trash',
      title: 'Trash Management',
      description: 'Safely delete files and restore them when needed.'
    },
    {
      icon: 'shield',
      title: 'Secure Access',
      description: 'Your data is protected with secure authentication.'
    }
  ];
}
