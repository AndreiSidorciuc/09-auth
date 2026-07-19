import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import type { Metadata } from "next";
import { Suspense } from "react";

import { fetchNotes } from "../../../../../lib/api/serverApi";

import NotesClient from "./Notes.client";

// Notes list changes often (create/delete), so fetch fresh data on every
// request instead of using the build-time static cache.
export const dynamic = "force-dynamic";

interface NotesFilterPageProps {
  params: Promise<{ slug?: string[] }>;
}

export async function generateMetadata({
  params,
}: NotesFilterPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tagSlug = slug?.[0] ?? "all";

  const title =
    tagSlug === "all" ? "All notes | NoteHub" : `${tagSlug} notes | NoteHub`;

  const description =
    tagSlug === "all"
      ? "Browse all your notes in NoteHub."
      : `Browse your notes tagged "${tagSlug}" in NoteHub.`;

  const url = `https://notehub.com/notes/filter/${tagSlug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
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
}

export default async function NotesFilterPage({
  params,
}: NotesFilterPageProps) {
  const { slug } = await params;

  const tagSlug = slug?.[0] ?? "all";
  const tag = tagSlug === "all" ? undefined : tagSlug;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", 1, "", tag ?? "all"],
    queryFn: () => fetchNotes({ page: 1, search: "", tag }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<p>Loading, please wait...</p>}>
        <NotesClient tag={tag} />
      </Suspense>
    </HydrationBoundary>
  );
}
