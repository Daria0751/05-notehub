import { useState, useEffect } from 'react';
import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';
import ReactPaginate from 'react-paginate';
import { useQuery } from '@tanstack/react-query';
import toast, { Toaster } from 'react-hot-toast';
import { fetchMovies } from '../../services/movieService';
import type { Movie } from '../../types/movie';

import css from './App.module.css';

const App = () => {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['movies', query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: !!query,
    placeholderData: (prev) => prev,
  });

  useEffect(() => {
    if (data && data.results.length === 0) {
      toast('No movies found for your request.');
    }
  }, [data]);

  const handleSearch = (formData: FormData) => {
    const newQuery = formData.get('query')?.toString().trim() || '';
    if (!newQuery) {
      toast.error('Please enter your search query.');
      return;
    }
    setQuery(newQuery);
    setPage(1);
  };

  const handleSelect = (movie: Movie) => setSelectedMovie(movie);
  const handleCloseModal = () => setSelectedMovie(null);

  const shouldShowGrid =
    !isLoading && !isError && data?.results && data.results.length > 0;

  return (
    <div>
      <Toaster />
      <SearchBar action={handleSearch} />
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {shouldShowGrid && (
        <>
          <MovieGrid movies={data.results} onSelect={handleSelect} />
          {data.total_pages > 1 && (
            <ReactPaginate
              pageCount={data.total_pages}
              pageRangeDisplayed={5}
              marginPagesDisplayed={1}
              onPageChange={({ selected }) => setPage(selected + 1)}
              forcePage={page - 1}
              containerClassName={css.pagination}
              activeClassName={css.active}
              nextLabel="→"
              previousLabel="←"
            />
          )}
        </>
      )}
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default App;




