"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { fetchNotes } from "../../../../../lib/api/clientApi";
import SearchBox from "../../../../../components/SearchBox/SearchBox";
import NoteList from "../../../../../components/NoteList/NoteList";
import Pagination from "../../../../../components/Pagination/Pagination";
import css from "./Notes.module.css";

interface NotesClientProps {
  tag?: string;
}

export default function NotesClient({ tag }: NotesClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const routeParams = useParams<{ slug?: string[] }>();

  const tagSlug = routeParams.slug?.[0] ?? "all";

  const page = Number(searchParams.get("page") ?? 1);
  const search = searchParams.get("search") ?? "";

  const { data, isLoading, isError, isPlaceholderData } = useQuery({
    queryKey: ["notes", page, search, tag ?? "all"],
    queryFn: () => fetchNotes({ page, search, tag }),
    refetchOnMount: false,
    placeholderData: keepPreviousData,
  });

  const handleSearch = useDebouncedCallback((value: string) => {
    router.push(
      `/notes/filter/${tagSlug}?search=${encodeURIComponent(value)}&page=1`,
    );
  }, 500);

  const handlePageChange = (newPage: number) => {
    router.push(
      `/notes/filter/${tagSlug}?page=${newPage}&search=${encodeURIComponent(search)}`,
    );
  };

  if (isLoading) return <p>Loading, please wait...</p>;
  if (isError) return <p>Something went wrong.</p>;

  return (
    <main className={css.app}>
      <div className={css.toolbar}>
        <SearchBox value={search} onSearch={handleSearch} />

        {data?.totalPages && data.totalPages > 1 && (
          <Pagination
            pageCount={data.totalPages}
            currentPage={page}
            onPageChange={handlePageChange}
          />
        )}

        <Link href="/notes/action/create" className={css.button}>
          Create note +
        </Link>
      </div>

      {data?.notes && data.notes.length > 0 ? (
        <div style={{ opacity: isPlaceholderData ? 0.6 : 1 }}>
          <NoteList notes={data.notes} />
        </div>
      ) : (
        <p>No notes found.</p>
      )}
    </main>
  );
}
