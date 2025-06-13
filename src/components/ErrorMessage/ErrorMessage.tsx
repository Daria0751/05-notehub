import { useField } from 'formik';
import styles from './ErrorMessage.module.css';

interface ErrorMessageProps {
  name: string;
  className?: string;
}

export default function ErrorMessage({ name, className }: ErrorMessageProps) {
  const [, meta] = useField(name);

  if (!meta.touched || !meta.error) {
    return null;
  }

  return <p className={className || styles.text}>{meta.error}</p>;
}
