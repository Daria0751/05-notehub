import { useEffect, useState } from 'react';
import type { Movie } from './types/movie';
import { fetchMovies } from './services/movieService';
import SearchBar from './components/SearchBar';
import MovieGrid from './components/MovieGrid/MovieGrid';
import Loader from './components/Loader/Loader';
import ErrorMessage from './components/ErrorMessage/ErrorMessage';
import MovieModal from './components/MovieModal/MovieModal';
import toast from 'react-hot-toast';


const App = () => {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  useEffect(() => {
    if (!query.trim()) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(false);
        setMovies([]); // Очищення перед новим запитом

        const results = await fetchMovies(query);

        if (results.length === 0) {
          toast('No movies found for your request.');
        }

        setMovies(results);
      } catch (err) {
        setError(true);
        toast.error('Something went wrong!');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query]);

  const handleSearch = (newQuery: string) => {
    if (!newQuery.trim()) {
      toast('Please enter your search query.');
      return;
    }

    setQuery(newQuery);
  };

  const handleSelect = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  const shouldShowGrid = !loading && !error && movies.length > 0;

  return (
    <div>
      <SearchBar onSubmit={handleSearch} />
      {loading && <Loader />}
      {error && <ErrorMessage />}
      {shouldShowGrid && <MovieGrid movies={movies} onSelect={handleSelect} />}
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default App;

