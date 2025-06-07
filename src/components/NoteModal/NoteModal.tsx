import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote } from '../../services/noteService';
import css from './NoteModal.module.css';

interface NoteModalProps {
  onClose: () => void;
  note?: {
    title: string;
    content: string;
  };
}

const NoteSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  content: Yup.string().required('Content is required'),
});

const NoteModal = ({ onClose, note }: NoteModalProps) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries(['notes']);
      onClose();
    },
  });

  return (
    <div className={css.backdrop}>
      <div className={css.modal}>
        <button className={css.close} onClick={onClose}>×</button>

        <Formik
          initialValues={{
            title: note?.title || '',
            content: note?.content || '',
          }}
          validationSchema={NoteSchema}
          onSubmit={(values) => {
            mutation.mutate(values);
          }}
        >
          {({ errors, touched }) => (
            <Form className={css.form}>
              <label>
                Title
                <Field name="title" className={css.input} />
                {errors.title && touched.title && <div className={css.error}>{errors.title}</div>}
              </label>
              <label>
                Content
                <Field as="textarea" name="content" className={css.textarea} />
                {errors.content && touched.content && <div className={css.error}>{errors.content}</div>}
              </label>
              <button type="submit" className={css.button}>Save Note</button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default NoteModal;



