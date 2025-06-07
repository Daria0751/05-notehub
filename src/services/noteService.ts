import axios from 'axios';
import type { AxiosResponse } from 'axios';
import type { Note, CreateNotePayload } from '../types/note';


const BASE_URL = 'https://notehub-public.goit.study/api';
const TOKEN = import.meta.env.VITE_NOTEHUB_TOKEN;

if (!TOKEN) {
  throw new Error('NoteHub API token is missing in environment variables.');
}

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${TOKEN}`,
  },
});

interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
}

interface FetchNotesResponse {
  notes: Note[];
  total: number;
  page: number;
  totalPages: number;
}

export const fetchNotes = async ({
  page = 1,
  perPage = 12,
  search = '',
}: FetchNotesParams): Promise<FetchNotesResponse> => {
  try {
    const response: AxiosResponse<any> = await axiosInstance.get('/notes', {
      params: {
        page,
        perPage,
        search,
      },
    });

    return {
      notes: response.data.data,
      total: response.data.total,
      page: response.data.page,
      totalPages: response.data.totalPages,
    };
  } catch (error) {
    console.error('Error fetching notes:', error);
    throw new Error('Failed to fetch notes.');
  }
};

export const createNote = async (
  payload: CreateNotePayload
): Promise<Note> => {
  try {
    const response: AxiosResponse<Note> = await axiosInstance.post('/notes', payload);
    return response.data;
  } catch (error) {
    console.error('Error creating note:', error);
    throw new Error('Failed to create note.');
  }
};

export const deleteNote = async (id: string): Promise<{ id: string }> => {
  try {
    const response: AxiosResponse<{ id: string }> = await axiosInstance.delete(`/notes/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting note:', error);
    throw new Error('Failed to delete note.');
  }
};





