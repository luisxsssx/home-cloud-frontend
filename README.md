# Personal Cloud

Angular frontend for a personal cloud storage application. Uses a Spring Boot backend for file management and authentication.

## Features

- **Authentication** — Login, registration, JWT auth with route guards
- **File Management** — Upload, download, rename, delete files and folders
- **Folder Navigation** — Breadcrumb trail with clickable segments for nested folders
- **Drag & Drop** — Drag files to move between folders; drag to the delete zone at the bottom
- **Search** — Filter files by name in the current directory
- **User Settings** — Profile editing, password change, storage overview, account deletion
- **Responsive** — Sidebar collapses on mobile

## Tech Stack

- Angular 17+
- TailwindCSS
- TypeScript

## Project Structure

```
src/app/
├── components/
│   ├── account-modal/      # Edit account modal
│   ├── confirm-modal/      # Reusable confirmation dialog
│   ├── home/               # Dashboard / landing after login
│   ├── landing/            # Public landing page
│   ├── login/              # Login form
│   ├── my-drive/           # Main file browser with drag-and-drop
│   ├── notification/       # Toast notification component
│   ├── recent/             # Recently accessed files
│   ├── register/           # Registration form
│   ├── settings/           # User settings page
│   ├── settings-sidebar/   # Settings navigation sidebar
│   ├── sidebar/            # App sidebar with folder tree
│   └── trash/              # Deleted files
├── guards/                 # Auth and guest route guards
├── interceptors/           # JWT interceptor
├── models/                 # TypeScript interfaces
├── services/               # API services (auth, files, notifications)
└── app.routes.ts           # Route definitions
```

## Development

```bash
npm install
ng serve
```

Navigate to `http://localhost:4200`.

## Build

```bash
ng build
```

Production build output goes to `dist/`.

## Environment

Configure the backend API URL in `src/environments/environment.ts`:

```ts
export const environment = {
  apiUrl: 'http://localhost:8080'
};
```
