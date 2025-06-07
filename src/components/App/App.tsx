import { useState, useEffect } from 'react';
import SearchBox from '../SearchBox/SearchBox';
import NoteList from '../NoteList/NoteList';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import NoteModal from '../NoteModal/NoteModal';
import Pagination from '../Pagination/Pagination';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import toast, { Toaster } from 'react-hot-toast';
import { fetchNotes } from '../../services/noteService';
import type { Note } from '../../types/note';

import css from './App.module.css';

const PER_PAGE = 12;

const App = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    isError,
  } = useQuery(
    ['notes', search, page],
    () => fetchNotes({ search, page, perPage: PER_PAGE }),
    {
      keepPreviousData: true,
      staleTime: 1000 * 60 * 5,
    }
  );

  useEffect(() => {
    if (data && data.notes.length === 0) {
      toast('No notes found for your request.');
    }
  }, [data]);

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handlePageChange = (selectedPage: number) => {
    setPage(selectedPage);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className={css.app}>
      <Toaster />
      <header className={css.toolbar}>
        <SearchBox onSearch={handleSearch} />
        <button className={css.button} onClick={openModal}>
          Create note +
        </button>
      </header>

      {isLoading && <Loader />}
      {isError && <ErrorMessage />}

      {data && data.notes.length > 0 && (
        <>
          <NoteList notes={data.notes} />
          {data.totalPages > 1 && (
            <Pagination
              pageCount={data.totalPages}
              currentPage={page}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}

      {isModalOpen && <NoteModal onClose={closeModal} />}
    </div>
  );
};

export default App;





