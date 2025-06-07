import axios from 'axios';
import type { Movie } from '../types/movie';

const BASE_URL = 'https://api.themoviedb.org/3';
const TOKEN = import.meta.env.VITE_TMDB_TOKEN;

if (!TOKEN) {
  throw new Error('TMDB API token is missing in environment variables.');
}

interface MovieApiResponse {
  page: number;
  total_pages: number;
  results: Movie[];
}

export const fetchMovies = async (
  query: string,
  page = 1
): Promise<MovieApiResponse> => {
  try {
    const response = await axios.get<MovieApiResponse>(`${BASE_URL}/search/movie`, {
      params: {
        query,
        include_adult: false,
        page,
      },
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw new Error('Failed to fetch movies.');
  }
};



