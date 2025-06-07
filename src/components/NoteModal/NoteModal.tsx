import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { Note } from '../../types/note';
import styles from './NoteModal.module.css';

interface NoteModalProps {
  note: Note;
  onClose: () => void;
}

const modalRoot = document.getElementById('modal-root') as HTMLElement;

export default function NoteModal({ note, onClose }: NoteModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleBodyOverflow = () => {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'auto';
      };
    };

    window.addEventListener('keydown', handleKeyDown);
    const cleanup = handleBodyOverflow();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      cleanup();
    };
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.currentTarget === e.target) {
      onClose();
    }
  };

  return createPortal(
    <div
      className={styles.backdrop}
      role="dialog"
      aria-modal="true"
      onClick={handleBackdropClick}
    >
      <div className={styles.modal}>
        <button
          className={styles.closeButton}
          aria-label="Close modal"
          onClick={onClose}
        >
          &times;
        </button>
        <div className={styles.content}>
          <h2>{note.title}</h2>
          <p>{note.content}</p>
          <p>
            <strong>Created:</strong> {note.createdAt}
          </p>
        </div>
      </div>
    </div>,
    modalRoot
  );
}


