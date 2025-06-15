import type { Note } from '../../types/note';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteNote } from '../../services/noteService';
import styles from './NoteList.module.css';

interface NoteListProps {
  notes: Note[];
  onSelect?: (note: Note) => void;
}

export default function NoteList({ notes, onSelect }: NoteListProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  const handleDelete = (id: number) => {
    mutation.mutate(id);
  };

  return (
    <ul className={styles.grid}>
      {notes.map(note => (
        <li key={note.id} className={styles.item}>
          <div
            className={styles.card}
            onClick={() => onSelect?.(note)}
          >
            <h2 className={styles.title}>{note.title}</h2>
            <p className={styles.content}>{note.content}</p>
            <p className={styles.tag}>Tag: {note.tag}</p>
          </div>
          <button
            className={styles.deleteButton}
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(note.id);
            }}
            disabled={mutation.isPending}
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}








