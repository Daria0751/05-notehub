import React from 'react';
import { Formik, Form, Field, ErrorMessage as FormikErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote } from '../../services/noteService';
import type { Note } from '../../types/note';

import css from './NoteForm.module.css';

interface NoteFormValues {
  title: string;
  content: string;
  tag: 'Todo' | 'Work' | 'Personal' | 'Meeting' | 'Shopping';
}

interface NoteFormProps {
  onClose: () => void;
  onSubmit: (values: NoteFormValues) => void;
  isSubmitting: boolean;
  initialValues: NoteFormValues;
}

const validationSchema = Yup.object({
  title: Yup.string()
    .min(3, 'Title must be at least 3 characters')
    .max(50, 'Title must be 50 characters or less')
    .required('Title is required'),
  content: Yup.string()
    .max(500, 'Content must be 500 characters or less')
    .required('Content is required'),
  tag: Yup.mixed<NoteFormValues['tag']>()
    .oneOf(['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'])
    .required('Tag is required'),
});

export default function NoteForm({ onClose, onSubmit, isSubmitting, initialValues }: NoteFormProps) {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values, actions) => {
        onSubmit(values);
        actions.setSubmitting(false);
      }}
    >
      {() => (
        <Form className={css.form}>
          <div className={css.formGroup}>
            <label htmlFor="title">Title</label>
            <Field id="title" name="title" className={css.input} />
            <FormikErrorMessage name="title" component="div" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="content">Content</label>
            <Field as="textarea" id="content" name="content" rows={5} className={css.textarea} />
            <FormikErrorMessage name="content" component="div" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="tag">Tag</label>
            <Field as="select" id="tag" name="tag" className={css.select}>
              <option value="Todo">Todo</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Meeting">Meeting</option>
              <option value="Shopping">Shopping</option>
            </Field>
            <FormikErrorMessage name="tag" component="div" className={css.error} />
          </div>

          <div className={css.actions}>
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Create note'}
            </button>
            <button type="button" onClick={onClose} className={css.cancelButton}>
              Cancel
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}







