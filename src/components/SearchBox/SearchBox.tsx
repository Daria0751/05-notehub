import type { FormEvent } from 'react';
import toast from 'react-hot-toast';
import styles from './SearchBox.module.css';

interface SearchBoxProps {
  action: (formData: FormData) => void;
}

export default function SearchBox({ action }: SearchBoxProps) {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('query')?.toString().trim();

    if (!query) {
      toast.error('Будь ласка, введіть текст для пошуку нотаток.');
      return;
    }

    action(formData);
    e.currentTarget.reset();
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <h1 className={styles.title}>NoteHub</h1>

        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            className={styles.input}
            type="text"
            name="query"
            autoComplete="off"
            placeholder="Пошук нотаток..."
            autoFocus
          />
          <button className={styles.button} type="submit">
            Пошук
          </button>
        </form>
      </div>
    </header>
  );
}



