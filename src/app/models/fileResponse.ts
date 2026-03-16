export interface FileResponse {
    id: string;
    name: string;
    size: number;
    contentType: string;
    uploadedAt: string;
    folderId?: string | null;
}