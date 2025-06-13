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
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery<NotesResponse, Error>({
    queryKey: ['notes', debouncedSearch, page],
    queryFn: () => fetchNotes(debouncedSearch, page),
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (data?.notes && data.notes.length === 0) {
      toast('No notes found for your request.');
    }
  }, [data]);

  useEffect(() => {
    if (isError && error instanceof Error) {
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
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedNote(null);
  };

  const handleSelectNote = (note: Note) => {
    setSelectedNote(note);
    setIsModalOpen(true);
  };

  return (
    <div className={css.app}>
      <Toaster />
      <header className={css.toolbar}>
        <SearchBox value={search} onSearch={handleSearch} onChange={handleSearch} />
        <button className={css.button} onClick={() => { setSelectedNote(null); openModal(); }}>
          Create note +
        </button>
      </header>

      {isLoading && <Loader />}
      {isError && !error?.message.includes('429') && <ErrorMessage />}

      {data?.notes && data.notes.length > 0 && (
        <>
          <NoteList notes={data.notes} onSelect={handleSelectNote} />
          {data.totalPages > 1 && (
            <Pagination
              pageCount={data.totalPages}  
              currentPage={page}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}

      {isModalOpen && <NoteModal onClose={closeModal} note={selectedNote ?? undefined} />}
    </div>
  );
};

export default App;














