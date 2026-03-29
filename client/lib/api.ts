import type { ApiErrorBody, AuthResponse, Favourite, Property, PublicProperty, User } from "./types";
import { getToken } from "./auth-token";

export class ApiError extends Error {
  status: number;
  details?: ApiErrorBody["details"];
  constructor(message: string, status: number, details?: ApiErrorBody["details"]) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);

  if (
    options.body &&
    typeof options.body === "string" &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
  }

  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(path, { ...options, headers });
  const text = await res.text();
  let data: unknown = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { error: text || "Unexpected response." };
  }

  const body = data as ApiErrorBody & Record<string, unknown>;

  if (!res.ok) {
    throw new ApiError(
      typeof body?.error === "string" ? body.error : "Request failed",
      res.status,
      body?.details
    );
  }

  return data as T;
}

export const api = {
  register: (body: { name: string; email: string; password: string }) =>
    request<AuthResponse>("/api/auth/register", { method: "POST", body: JSON.stringify(body) }),

  login: (body: { email: string; password: string }) =>
    request<AuthResponse>("/api/auth/login", { method: "POST", body: JSON.stringify(body) }),

  me: () => request<{ user: User }>("/api/auth/me"),

  publicProperties: () => request<{ properties: PublicProperty[] }>("/api/properties/public"),

  publicProperty: (id: number) =>
    request<{ property: PublicProperty }>(`/api/properties/public/${id}`),

  properties: () => request<{ properties: Property[] }>("/api/properties"),

  favourites: () => request<{ favourites: Favourite[] }>("/api/favourites"),

  addFavourite: (propertyId: number) =>
    request<{ message: string }>("/api/favourites", {
      method: "POST",
      body: JSON.stringify({ propertyId }),
    }),

  removeFavourite: (propertyId: number) =>
    request<{ message: string }>(`/api/favourites/${propertyId}`, { method: "DELETE" }),
};
