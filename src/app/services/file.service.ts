import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { FileResponse } from '../models/fileResponse';
import { FolderResponse } from '../models/folderResponse';
import { FolderDataBase } from '../models/folderDataBase.model';
import { RenameRequest } from '../models/renameRequest';
import { FileItemResponse } from '../models/fileItemResponse';

export interface BucketModel {
  bucket_id: number;
  bucket_name: string;
}

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private readonly apiUrl = `${environment.apiUrl}/cloud/files`;

  bucketName = signal<string | null>(null);
  bucketInfoLoaded = signal(false);

  constructor(private http: HttpClient) { }

  private getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  private getBucketName(): string {
    const name = this.bucketName();
    if (name) return name;
    const token = this.getToken();
    if (!token) return '';
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const accountId = payload.account_id || '';
      return `account${accountId}`;
    } catch {
      return '';
    }
  }

  private getAccountId(): number | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.account_id || null;
    } catch {
      return null;
    }
  }

  loadBucketInfo(): Observable<BucketModel[]> {
    return this.http.post<BucketModel[]>(`${environment.apiUrl}/bucket/id`, {}).pipe(
      tap(buckets => {
        if (buckets.length > 0) {
          this.bucketName.set(buckets[0].bucket_name);
          this.bucketInfoLoaded.set(true);
        }
      })
    );
  }

  uploadFile(file: File, folderName?: string | null): Observable<FileResponse> {
    const formData = new FormData();

    formData.append('file', file);

    const data = {
      folder_name: folderName ?? null,
      bucket_name: this.getBucketName()
    };

    formData.append(
      'data',
      new Blob([JSON.stringify(data)], { type: 'application/json' })
    );

    return this.http.post<FileResponse>(`${this.apiUrl}/upload`, formData);
  }

  listRoot(folder_name: string): Observable<any> {
    const data = {
      bucket_name: this.getBucketName(),
      account_id: this.getAccountId(),
      folder_name
    };
    return this.http.post<any>(`${this.apiUrl}/list`, data);
  }

  deleteFile(fileName: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete`, {
      body: { file_name: fileName, bucket_name: this.getBucketName() }
    });
  }

  deleteFolder(folderName: string): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/cloud/delete/folder`, {
      bucket_name: this.getBucketName(),
      folder_name: folderName
    });
  }

  renameItem(request: RenameRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/rename`, {
      ...request,
      bucket_name: this.getBucketName()
    });
  }

  createFolder(folderName: string): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/cloud/create/folder`, {
      folder_name: folderName,
      bucket_name: this.getBucketName()
    });
  }

  listAllFiles(): Observable<FileItemResponse[]> {
    return this.http.get<FileItemResponse[]>(`${this.apiUrl}/all`);
  }

  listFolders(): Observable<FolderDataBase[]> {
    return this.http.post<FolderDataBase[]>(`${environment.apiUrl}/cloud/list-root-folders`, {});
  }

  listAllFolders(): Observable<FolderDataBase[]> {
    return this.http.post<FolderDataBase[]>(`${environment.apiUrl}/cloud/list-folders`, {});
  }

  downloadFile(fileName: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/download/${encodeURIComponent(fileName)}`, {
      responseType: 'blob'
    });
  }

  moveItem(sourcePath: string, targetPath: string): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/cloud/move/data`, { sourcePath, targetPath });
  }
}