export interface RenameRequest {
  old_file_name: string;
  new_file_name: string;
  itemType: 'FILE' | 'FOLDER';
}
