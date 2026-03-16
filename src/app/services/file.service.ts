import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { FileResponse } from '../models/fileResponse';
import { FolderResponse } from '../models/folderResponse';

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

  listRoot(folderName: string | null): Observable<FolderResponse[]> {
    const data = { folder_name: folderName };
    return this.http.post<FolderResponse[]>(`${this.apiUrl}/list`, data);
  }
}
