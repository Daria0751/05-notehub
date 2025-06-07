import type { Movie } from '../../types/note';
import styles from './NoteList.module.css';

interface NoteListProps {
  movies: Movie[];
  onSelect: (movie: Movie) => void;
}

export default function NoteList({ movies, onSelect }: NoteListProps) {
  return (
    <ul className={styles.grid}>
      {movies.map(movie => (
        <li key={movie.id} onClick={() => onSelect(movie)} className={styles.item}>
          <div className={styles.card}>
            <img
              className={styles.image}
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              loading="lazy"
            />
            <h2 className={styles.title}>{movie.title}</h2>
          </div>
        </li>
      ))}
    </ul>
  );
}




