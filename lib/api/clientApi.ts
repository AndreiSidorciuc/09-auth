import type { AxiosResponse } from "axios";

import { api } from "./api";

import type { Note, NoteTag } from "../../types/note";
import type { User } from "../../types/user";

export interface FetchNotesParams {
  page: number;
  perPage?: number;
  search?: string;
  tag?: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface CreateNotePayload {
  title: string;
  content: string;
  tag: NoteTag;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UpdateMeRequest {
  username?: string;
}

interface CheckSessionResponse {
  success: boolean;
}

// Notes

export const fetchNotes = async (
  params: FetchNotesParams,
): Promise<FetchNotesResponse> => {
  const response: AxiosResponse<FetchNotesResponse> = await api.get("/notes", {
    params: {
      page: params.page,
      perPage: params.perPage ?? 12,
      ...(params.search ? { search: params.search } : {}),
      ...(params.tag && params.tag !== "all" ? { tag: params.tag } : {}),
    },
  });

  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const response: AxiosResponse<Note> = await api.get(`/notes/${id}`);

  return response.data;
};

export const createNote = async (payload: CreateNotePayload): Promise<Note> => {
  const response: AxiosResponse<Note> = await api.post("/notes", payload);

  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const response: AxiosResponse<Note> = await api.delete(`/notes/${id}`);

  return response.data;
};

// Auth

export const register = async (payload: RegisterRequest): Promise<User> => {
  const response: AxiosResponse<User> = await api.post(
    "/auth/register",
    payload,
  );

  return response.data;
};

export const login = async (payload: LoginRequest): Promise<User> => {
  const response: AxiosResponse<User> = await api.post("/auth/login", payload);

  return response.data;
};

export const logout = async (): Promise<void> => {
  await api.post("/auth/logout");
};

export const checkSession = async (): Promise<boolean> => {
  const response: AxiosResponse<CheckSessionResponse> =
    await api.get("/auth/session");

  return response.data.success;
};

// Users

export const getMe = async (): Promise<User> => {
  const response: AxiosResponse<User> = await api.get("/users/me");

  return response.data;
};

export const updateMe = async (payload: UpdateMeRequest): Promise<User> => {
  const response: AxiosResponse<User> = await api.patch("/users/me", payload);

  return response.data;
};
