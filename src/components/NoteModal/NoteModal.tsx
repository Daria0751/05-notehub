import { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import NoteForm from '../NoteForm/NoteForm';
import { createNote } from '../../services/noteService';
import css from './NoteModal.module.css';

interface NoteModalProps {
  onClose: () => void;
  note?: {
    title: string;
    content: string;
    tag?: 'Todo' | 'Work' | 'Personal' | 'Meeting' | 'Shopping';
  };
}

interface NoteFormValues {
  title: string;
  content: string;
  tag: 'Todo' | 'Work' | 'Personal' | 'Meeting' | 'Shopping';
}

const modalRoot = document.body;

export default function NoteModal({ onClose, note }: NoteModalProps) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      onClose();
    },
    onError: (error) => {
      console.error('Failed to create note:', error);
    },
  });

  const handleSubmit = (values: NoteFormValues) => {
    mutation.mutate(values);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const initialValues: NoteFormValues = {
    title: note?.title || '',
    content: note?.content || '',
    tag: note?.tag || 'Todo',
  };

  return ReactDOM.createPortal(
    <div className={css.backdrop} onClick={handleBackdropClick}>
      <div className={css.modal}>
        <button className={css.close} onClick={onClose} aria-label="Close modal">
          ×
        </button>
        <NoteForm
          onSubmit={handleSubmit}
          onClose={onClose}
          isSubmitting={mutation.isPending}
          initialValues={initialValues}
        />
      </div>
    </div>,
    modalRoot
  );
}








