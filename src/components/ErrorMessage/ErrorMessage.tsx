import styles from './ErrorMessage.module.css';

interface ErrorMessageProps {
  message: string;
  className?: string;
}

export default function ErrorMessage({ message, className }: ErrorMessageProps) {
  if (!message) return null;

  return <p className={className || styles.text}>{message}</p>;
}



