"use client";

import { useState, type ChangeEvent } from "react";

import { useRouter } from "next/navigation";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import * as Yup from "yup";

import { createNote } from "../../lib/api/clientApi";

import { useNoteStore } from "../../lib/store/noteStore";

import type { NoteTag } from "../../types/note";

import css from "./NoteForm.module.css";

interface NoteFormErrors {
  title?: string;
  content?: string;
  tag?: string;
}

const NoteFormSchema = Yup.object({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title must be at most 50 characters")
    .required("Title is required"),

  content: Yup.string().max(500, "Content must be at most 500 characters"),

  tag: Yup.string()
    .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"], "Invalid tag")
    .required("Tag is required"),
});

export default function NoteForm() {
  const router = useRouter();

  const queryClient = useQueryClient();

  const { draft, setDraft, clearDraft } = useNoteStore();

  const [errors, setErrors] = useState<NoteFormErrors>({});

  const mutation = useMutation({
    mutationFn: createNote,

    onSuccess: () => {
      clearDraft();

      queryClient.invalidateQueries({
        queryKey: ["notes"],
      });

      router.push("/notes/filter/all");
    },
  });

  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = event.target;

    setDraft({
      ...draft,
      [name]: value,
    });
  };

  const handleCancel = () => {
    // Draft is intentionally kept so the user can resume later.
    router.back();
  };

  const handleSubmit = async (formData: FormData) => {
    const values = {
      title: (formData.get("title") as string) ?? "",
      content: (formData.get("content") as string) ?? "",
      tag: (formData.get("tag") as NoteTag) ?? "Todo",
    };

    try {
      await NoteFormSchema.validate(values, { abortEarly: false });
    } catch (validationError) {
      if (validationError instanceof Yup.ValidationError) {
        const nextErrors: NoteFormErrors = {};

        validationError.inner.forEach((issue) => {
          const path = issue.path as keyof NoteFormErrors | undefined;

          if (path && !nextErrors[path]) {
            nextErrors[path] = issue.message;
          }
        });

        setErrors(nextErrors);
      }

      return;
    }

    setErrors({});

    mutation.mutate(values);
  };

  return (
    <form action={handleSubmit} className={css.form}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>

        <input
          id="title"
          name="title"
          type="text"
          defaultValue={draft.title}
          onChange={handleChange}
          className={css.input}
        />

        {errors.title && <span className={css.error}>{errors.title}</span>}
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>

        <textarea
          id="content"
          name="content"
          rows={8}
          defaultValue={draft.content}
          onChange={handleChange}
          className={css.textarea}
        />

        {errors.content && <span className={css.error}>{errors.content}</span>}
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>

        <select
          id="tag"
          name="tag"
          defaultValue={draft.tag}
          onChange={handleChange}
          className={css.select}
        >
          <option value="Todo">Todo</option>

          <option value="Work">Work</option>

          <option value="Personal">Personal</option>

          <option value="Meeting">Meeting</option>

          <option value="Shopping">Shopping</option>
        </select>

        {errors.tag && <span className={css.error}>{errors.tag}</span>}
      </div>

      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={handleCancel}
        >
          Cancel
        </button>

        <button
          type="submit"
          className={css.submitButton}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Creating..." : "Create note"}
        </button>
      </div>
    </form>
  );
}
