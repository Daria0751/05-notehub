import React from 'react';
import { Formik, Form, Field, ErrorMessage as FormikErrorMessage } from 'formik';
import * as Yup from 'yup';

import css from './NoteForm.module.css';

export interface NoteFormValues {
  title: string;
  content: string;
  tag: 'Todo' | 'Work' | 'Personal' | 'Meeting' | 'Shopping';
}

interface NoteFormProps {
  initialValues: NoteFormValues;
  onSubmit: (values: NoteFormValues) => void;
  onClose: () => void;
  isSubmitting: boolean;
}

const validationSchema = Yup.object({
  title: Yup.string().required('Title is required'),
  content: Yup.string().required('Content is required'),
  tag: Yup.mixed<NoteFormValues['tag']>()
    .oneOf(['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'])
    .required('Tag is required'),
});

const NoteForm: React.FC<NoteFormProps> = ({ initialValues, onSubmit, onClose, isSubmitting }) => {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values, actions) => {
        onSubmit(values);
        actions.setSubmitting(false);
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <div>
            <label htmlFor="title">Title</label>
            <Field id="title" name="title" type="text" />
            <FormikErrorMessage name="title" component="div" className={css.error} />
          </div>

          <div>
            <label htmlFor="content">Content</label>
            <Field id="content" name="content" as="textarea" rows={5} />
            <FormikErrorMessage name="content" component="div" className={css.error} />
          </div>

          <div>
            <label htmlFor="tag">Tag</label>
            <Field id="tag" name="tag" as="select">
              <option value="Todo">Todo</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Meeting">Meeting</option>
              <option value="Shopping">Shopping</option>
            </Field>
            <FormikErrorMessage name="tag" component="div" className={css.error} />
          </div>

          <div style={{ marginTop: '1rem' }}>
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
            <button type="button" onClick={onClose} style={{ marginLeft: '1rem' }}>
              Cancel
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default NoteForm;





