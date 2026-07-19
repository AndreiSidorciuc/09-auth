"use client";

import { useQuery } from "@tanstack/react-query";

import { useParams, useRouter } from "next/navigation";

import { fetchNoteById } from "../../../../../lib/api/clientApi";

import Modal from "../../../../../components/Modal/Modal";

import css from "./NotePreview.module.css";

export default function NotePreviewClient() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const handleClose = () => {
    router.back();
  };

  const {
    data: note,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["note", id],

    queryFn: () => fetchNoteById(id),

    refetchOnMount: false,
  });

  if (isLoading) {
    return (
      <Modal onClose={handleClose}>
        <p>Loading, please wait...</p>
      </Modal>
    );
  }

  if (isError || !note) {
    return (
      <Modal onClose={handleClose}>
        <p>Something went wrong.</p>
      </Modal>
    );
  }

  return (
    <Modal onClose={handleClose}>
      <div className={css.container}>
        <div className={css.item}>
          <div className={css.header}>
            <h2>{note.title}</h2>
          </div>

          <p className={css.tag}>{note.tag}</p>

          <p className={css.content}>{note.content}</p>

          <p className={css.date}>{note.createdAt}</p>

          <button type="button" className={css.backBtn} onClick={handleClose}>
            ← Back
          </button>
        </div>
      </div>
    </Modal>
  );
}
