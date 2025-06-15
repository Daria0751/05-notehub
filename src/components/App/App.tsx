import { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import { useQuery } from '@tanstack/react-query';
import toast, { Toaster } from 'react-hot-toast';

import SearchBox from '../SearchBox/SearchBox';
import NoteList from '../NoteList/NoteList';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import NoteModal from '../NoteModal/NoteModal';
import Pagination from '../Pagination/Pagination';

import { fetchNotes } from '../../services/noteService';
import type { Note } from '../../types/note';

import css from './App.module.css';

interface NotesResponse {
  notes: Note[];
  totalPages: number;
}

const App = () => {
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 1000);
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery<NotesResponse, Error>({
    queryKey: ['notes', debouncedSearch, page],
    queryFn: () => fetchNotes(debouncedSearch, page),
    staleTime: 1000 * 60 * 5,
    placeholderData: { notes: [], totalPages: 1 },
  });

  // Для дебагу
  useEffect(() => {
    console.log('Fetched notes:', data);
  }, [data]);

  // Повідомлення, якщо нотаток немає
  useEffect(() => {
    if (data && data.notes.length === 0) {
      toast('No notes found for your request.');
    }
  }, [data]);

  // Повідомлення про помилки
  useEffect(() => {
    if (isError && error?.message) {
      if (error.message.includes('429')) {
        toast.error('Too many requests. Please wait a moment and try again.');
      } else {
        toast.error(error.message);
      }
    }
  }, [isError, error]);

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
        <SearchBox value={search} onChange={handleSearch} />
        <button className={css.button} onClick={openModal}>
          Create note +
        </button>
      </header>

      {isLoading && <Loader />}

      {isError && error && !error.message.includes('429') && (
        <ErrorMessage name="" className={css.errorText}>
          {error.message}
        </ErrorMessage>
      )}

      {data && data.notes.length > 0 ? (
        <>
          <NoteList notes={data.notes} />
          {data.totalPages > 1 && (
            <Pagination
              totalPages={data.totalPages}
              currentPage={page}
              onPageChange={handlePageChange}
            />
          )}
        </>
      ) : null}

      {isModalOpen && <NoteModal onClose={closeModal} />}
    </div>
  );
};

export default App;


























