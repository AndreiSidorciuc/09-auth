import type { Metadata } from "next";

import NoteForm from "../../../../../components/NoteForm/NoteForm";

import css from "./CreateNote.module.css";

const PAGE_URL = "https://notehub.com/notes/action/create";

export const metadata: Metadata = {
  title: "Create note | NoteHub",
  description:
    "Create a new note in NoteHub. Add a title, content and tag to keep your thoughts organized.",
  openGraph: {
    title: "Create note | NoteHub",
    description:
      "Create a new note in NoteHub. Add a title, content and tag to keep your thoughts organized.",
    url: PAGE_URL,
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "NoteHub",
      },
    ],
  },
};

export default function CreateNote() {
  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Create note</h1>

        <NoteForm />
      </div>
    </main>
  );
}
