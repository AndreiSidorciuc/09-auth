import type { AxiosResponse } from "axios";

import { cookies } from "next/headers";

import { api } from "./api";

import type { Note } from "../../types/note";
import type { User } from "../../types/user";

import type { FetchNotesParams, FetchNotesResponse } from "./clientApi";

export interface CheckSessionResponse {
  success: boolean;
}

export const fetchNotes = async (
  params: FetchNotesParams,
): Promise<FetchNotesResponse> => {
  const cookieStore = await cookies();

  const response: AxiosResponse<FetchNotesResponse> = await api.get("/notes", {
    params: {
      page: params.page,
      perPage: params.perPage ?? 12,
      ...(params.search ? { search: params.search } : {}),
      ...(params.tag && params.tag !== "all" ? { tag: params.tag } : {}),
    },
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const cookieStore = await cookies();

  const response: AxiosResponse<Note> = await api.get(`/notes/${id}`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return response.data;
};

export const getMe = async (): Promise<User> => {
  const cookieStore = await cookies();

  const response: AxiosResponse<User> = await api.get("/users/me", {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return response.data;
};

export const checkSession = async (): Promise<
  AxiosResponse<CheckSessionResponse>
> => {
  const cookieStore = await cookies();

  const response: AxiosResponse<CheckSessionResponse> = await api.get(
    "/auth/session",
    {
      headers: {
        Cookie: cookieStore.toString(),
      },
    },
  );

  return response;
};
