import axios from 'axios';
import type { AxiosResponse } from 'axios';
import type { Note, NewNoteData } from '../types/note';

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

interface FetchNotesResponse {
  notes: Note[];
  total: number;
  page: number;
  totalPages: number;
}

export const fetchNotes = async (
  search: string,
  page: number
): Promise<FetchNotesResponse> => {
  try {
    const response: AxiosResponse<{
      data: Note[];
      total: number;
      page: number;
      totalPages: number;
    }> = await axiosInstance.get('/notes', {
      params: {
        search: typeof search === 'string' && search.trim() !== '' ? search.trim() : undefined,
        page,
        perPage: 12,
      },
    });

    return {
      notes: response.data.data,
      total: response.data.total,
      page: response.data.page,
      totalPages: response.data.totalPages,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error fetching notes:', error.response?.status, error.response?.data);
    } else {
      console.error('Unknown error fetching notes:', error);
    }
    throw new Error('Failed to fetch notes.');
  }
};

export const createNote = async (
  payload: NewNoteData
): Promise<Note> => {
  try {
    const response: AxiosResponse<Note> = await axiosInstance.post('/notes', payload);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error creating note:', error.response?.status, error.response?.data);
    } else {
      console.error('Unknown error creating note:', error);
    }
    throw new Error('Failed to create note.');
  }
};

export const deleteNote = async (id: string): Promise<Note> => {
  try {
    const response: AxiosResponse<Note> = await axiosInstance.delete(`/notes/${id}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error deleting note:', error.response?.status, error.response?.data);
    } else {
      console.error('Unknown error deleting note:', error);
    }
    throw new Error('Failed to delete note.');
  }
};









