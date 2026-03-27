import { Injectable, signal } from '@angular/core';

export interface RecentItem {
  name: string;
  path: string;
  size: number;
  accessedAt: Date;
}

export interface TrashItem {
  name: string;
  path: string;
  size: number;
  deletedAt: Date;
  originalData?: any;
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly RECENT_KEY = 'cloud_recent';
  private readonly TRASH_KEY = 'cloud_trash';
  private readonly MAX_RECENT = 50;

  recentItems = signal<RecentItem[]>([]);
  trashItems = signal<TrashItem[]>([]);

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    const recent = localStorage.getItem(this.RECENT_KEY);
    const trash = localStorage.getItem(this.TRASH_KEY);

    if (recent) {
      const parsed = JSON.parse(recent);
      this.recentItems.set(parsed.map((item: any) => ({
        ...item,
        accessedAt: new Date(item.accessedAt)
      })));
    }

    if (trash) {
      const parsed = JSON.parse(trash);
      this.trashItems.set(parsed.map((item: any) => ({
        ...item,
        deletedAt: new Date(item.deletedAt)
      })));
    }
  }

  private saveRecentToStorage(): void {
    localStorage.setItem(this.RECENT_KEY, JSON.stringify(this.recentItems()));
  }

  private saveTrashToStorage(): void {
    localStorage.setItem(this.TRASH_KEY, JSON.stringify(this.trashItems()));
  }

  addToRecent(item: { name: string; path: string; size: number }): void {
    const newItem: RecentItem = {
      ...item,
      accessedAt: new Date()
    };

    const filtered = this.recentItems().filter(
      existing => !(existing.name === newItem.name && existing.path === newItem.path)
    );

    const updated = [newItem, ...filtered].slice(0, this.MAX_RECENT);
    this.recentItems.set(updated);
    this.saveRecentToStorage();
  }

  moveToTrash(item: { name: string; path: string; size: number }, originalData?: any): void {
    const trashItem: TrashItem = {
      ...item,
      deletedAt: new Date(),
      originalData
    };

    const updated = [trashItem, ...this.trashItems()];
    this.trashItems.set(updated);
    this.saveTrashToStorage();
  }

  restoreFromTrash(itemName: string): TrashItem | undefined {
    const items = this.trashItems();
    const itemIndex = items.findIndex(item => item.name === itemName);
    
    if (itemIndex === -1) return undefined;

    const [restored] = items.splice(itemIndex, 1);
    this.trashItems.set([...items]);
    this.saveTrashToStorage();

    return restored;
  }

  permanentDelete(itemName: string): void {
    const updated = this.trashItems().filter(item => item.name !== itemName);
    this.trashItems.set(updated);
    this.saveTrashToStorage();
  }

  emptyTrash(): void {
    this.trashItems.set([]);
    this.saveTrashToStorage();
  }

  clearRecent(): void {
    this.recentItems.set([]);
    this.saveRecentToStorage();
  }

  getTrashCount(): number {
    return this.trashItems().length;
  }
}
