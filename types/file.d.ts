export type FileExtrasField = {
  name: string;
  extension: string;
  size: string;
}

export type File = {
  id: number;
  project_id: number;
  thumbnail: string;
  path: string;
  extras_field: FileExtrasField;
  open_lasted_at: any;
  created_at: string;
  updated_at: string;
}

export type Files = File[];
