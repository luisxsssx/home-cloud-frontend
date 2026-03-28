import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { FileResponse } from '../models/fileResponse';
import { FolderResponse } from '../models/folderResponse';
import { RenameRequest } from '../models/renameRequest';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private readonly apiUrl = `${environment.apiUrl}/cloud/files`;

  constructor(private http: HttpClient) { }

  uploadFile(file: File, folderName?: string | null): Observable<FileResponse> {
    const formData = new FormData();

    formData.append('file', file);

    const data = {
      folder_name: folderName ?? null
    };

    formData.append(
      'data',
      new Blob([JSON.stringify(data)], { type: 'application/json' })
    );

    return this.http.post<FileResponse>(`${this.apiUrl}/upload`, formData);
  }

  listRoot(folder_name: string): Observable<any> {
    const data = { folder_name };
    return this.http.post<any>(`${this.apiUrl}/list`, data);
  }

  deleteFile(fileName: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete`, { body: { file_name: fileName } });
  }

  deleteFolder(folderName: string): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/cloud/delete/folder`, { folder_name: folderName });
  }

  renameItem(request: RenameRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/rename`, request);
  }

  createFolder(folderName: string): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/cloud/create/folder`, { folder_name: folderName });
  }
}