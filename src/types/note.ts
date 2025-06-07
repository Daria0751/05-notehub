export interface Note {
  _id: string;
  title: string;
  content: string;
  tag: Tag;
  createdAt: string;
  updatedAt: string;
}

export type Tag = 'Todo' | 'Work' | 'Personal' | 'Meeting' | 'Shopping';

export interface CreateNotePayload {
  title: string;
  content?: string;
  tag: Tag;
}





