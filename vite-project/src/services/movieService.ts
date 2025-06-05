import axios from 'axios';
import { Movie } from '../types/movie';

const BASE_URL = 'https://api.themoviedb.org/3';
const TOKEN = import.meta.env.VITE_TMDB_TOKEN;

if (!TOKEN) {
  throw new Error('TMDB API token is missing in environment variables.');
}

export const fetchMovies = async (query: string): Promise<Movie[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/search/movie`, {
      params: {
        query,
        include_adult: false,
      },
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });

    return response.data.results;
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw new Error('Failed to fetch movies.');
  }
};

