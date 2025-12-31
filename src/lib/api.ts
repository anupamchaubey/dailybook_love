// src/lib/api.ts

import {
  ApiRoutes,
  HttpMethod,
  RegisterRequest,
  LoginRequest,
  LoginResponse,
  EntryRequest,
  EntryResponse,
  GetMyEntriesResponse,
  PublicEntriesResponse,
  UserPublicEntriesResponse,
  SearchEntriesResponse,
  FeedEntriesResponse,
  SendFollowRequestResponse,
  UnfollowResponse,
  FollowersResponse,
  FollowingResponse,
  PendingFollowRequestsResponse,
  ApproveFollowResponse,
  RejectFollowResponse,
  ListNotificationsResponse,
  UnreadNotificationsCountResponse,
  UserEntriesResponse,
  GetMyProfileResponse,
  UpdateMyProfileResponse,
  GetProfileByUsernameResponse,
  SearchUsersResponse,
} from "@/types/api";

// ============================
// Auth token handling
// ============================

const TOKEN_KEY = "dailybook_token";
const TOKEN_EXPIRES_AT_KEY = "dailybook_token_expiresAt";
const USERNAME_KEY = "dailybook_username"; // <- added

// Adjust base URL according to your setup.
// If you are proxying /api from Vite to Spring Boot, this can stay as "".
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

export function getStoredToken(): string | null {
  const token = localStorage.getItem(TOKEN_KEY);
  const expStr = localStorage.getItem(TOKEN_EXPIRES_AT_KEY);

  if (!token || !expStr) {
    return null;
  }

  const exp = Number(expStr);
  if (!Number.isFinite(exp)) {
    // bad value -> clear
    clearStoredAuth();
    return null;
  }

  // exp should be milliseconds since epoch. Some backends return seconds.
  // If exp looks like seconds (smaller than 1e12), convert to ms for comparison.
  const expMs = exp < 1e12 ? exp * 1000 : exp;

  if (Date.now() > expMs) {
    // Token expired → clear and treat as logged out
    clearStoredAuth();
    return null;
  }

  return token;
}


export function getStoredTokenExpiry(): number | null {
  const val = localStorage.getItem(TOKEN_EXPIRES_AT_KEY);
  return val ? Number(val) : null;
}

export function storeLogin(res: LoginResponse) {
  localStorage.setItem(TOKEN_KEY, res.token);

  // Ensure expiresAt saved in milliseconds
  const raw = Number(res.expiresAt);
  const expiresAtMs = Number.isFinite(raw) ? (raw < 1e12 ? raw * 1000 : raw) : (Date.now() + 7 * 24 * 3600 * 1000);
  localStorage.setItem(TOKEN_EXPIRES_AT_KEY, String(expiresAtMs));

  // store username for other parts of the UI that rely on it
  // (login response is expected to include username)
  // protect against undefined by only setting when present
  // @ts-ignore - LoginResponse may include username
  if ((res as any).username) {
    // @ts-ignore
    localStorage.setItem(USERNAME_KEY, (res as any).username);
  }
}

export function clearStoredAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_EXPIRES_AT_KEY);
  localStorage.removeItem(USERNAME_KEY);
}

// convenience accessor for username
export function getStoredUsername(): string | null {
  return localStorage.getItem(USERNAME_KEY);
}

// ============================
// Generic helpers
// ============================

type QueryParams = Record<string, string | number | boolean | undefined | null>;

function buildUrl(path: string, query?: QueryParams): string {
  const url = new URL(API_BASE_URL + path, window.location.origin);
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }
  return url.toString();
}

interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  auth?: boolean;
  query?: QueryParams;
  // for endpoints returning text or empty body
  expect?: "json" | "text" | "void";
}

async function apiRequest<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const {
    method = "GET",
    body,
    auth = true,
    query,
    expect = "json",
  } = options;

  const url = buildUrl(path, query);

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (auth) {
    const token = getStoredToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    // Try to extract error message if backend sends any
    const text = await res.text();
    throw new Error(text || `Request failed with status ${res.status}`);
  }

  if (expect === "void") {
    // @ts-expect-error - caller expects void / never uses return
    return undefined;
  }
  if (expect === "text") {
    // @ts-expect-error - caller knows it's a string
    return (await res.text()) as T;
  }
  return (await res.json()) as T;
}

// ============================
// 1. Auth
// ============================

export async function registerUser(
  payload: RegisterRequest
): Promise<string> {
  // returns plain text
  return apiRequest<string>(ApiRoutes.REGISTER, {
    method: "POST",
    body: payload,
    auth: false, // registration should not require auth
    expect: "text",
  });
}

export async function loginUser(
  payload: LoginRequest
): Promise<LoginResponse> {
  const res = await apiRequest<LoginResponse>(ApiRoutes.LOGIN, {
    method: "POST",
    body: payload,
    auth: false,
    expect: "json",
  });
  // Persist token + username (if returned)
  storeLogin(res);
  return res;
}

// ============================
// 2. Entries / Posts
// ============================

export async function createEntry(
  payload: EntryRequest
): Promise<EntryResponse> {
  return apiRequest<EntryResponse>(ApiRoutes.ENTRIES, {
    method: "POST",
    body: payload,
  });
}
export async function updateEntry(
  id: string,
  payload: EntryRequest
): Promise<EntryResponse> {
  return apiRequest<EntryResponse>(`${ApiRoutes.ENTRIES}/${id}`, {
    method: "PUT", // or PATCH if your backend uses PATCH
    body: payload,
  });
}


export async function getMyEntries(): Promise<GetMyEntriesResponse> {
  return apiRequest<GetMyEntriesResponse>(ApiRoutes.ENTRIES);
}

export async function getEntryById(id: string): Promise<EntryResponse> {
  return apiRequest<EntryResponse>(`${ApiRoutes.ENTRIES}/${id}`);
}

export async function deleteEntry(id: string): Promise<string> {
  return apiRequest<string>(`${ApiRoutes.ENTRIES}/${id}`, {
    method: "DELETE",
    expect: "text",
  });
}

export async function getPublicEntries(
  page = 0,
  size = 10
): Promise<PublicEntriesResponse> {
  return apiRequest<PublicEntriesResponse>(ApiRoutes.ENTRIES_PUBLIC, {
    query: { page, size },
  });
}

export async function getUserPublicEntries(
  username: string,
  page = 0,
  size = 10
): Promise<UserPublicEntriesResponse> {
  return apiRequest<UserPublicEntriesResponse>(
    `${ApiRoutes.ENTRIES_PUBLIC_USER}/${username}`,
    { query: { page, size } }
  );
}

export async function searchPublicEntries(
  queryStr: string,
  page = 0,
  size = 10
): Promise<SearchEntriesResponse> {
  return apiRequest<SearchEntriesResponse>(
    ApiRoutes.ENTRIES_PUBLIC_SEARCH,
    { query: { q: queryStr, page, size } }
  );
}


export async function getFeedEntries(
  page = 0,
  size = 10
): Promise<FeedEntriesResponse> {
  return apiRequest<FeedEntriesResponse>(ApiRoutes.ENTRIES_FEED, {
    query: { page, size },
  });
}

// ============================
// 3. Follow / Social
// ============================

export async function sendFollowRequest(
  username: string
): Promise<SendFollowRequestResponse> {
  return apiRequest<SendFollowRequestResponse>(
    `${ApiRoutes.FOLLOW}/${username}`,
    { method: "POST" }
  );
}

export async function unfollowUser(
  username: string
): Promise<UnfollowResponse> {
  return apiRequest<UnfollowResponse>(
    `${ApiRoutes.FOLLOW}/${username}`,
    { method: "DELETE" }
  );
}

export async function getMyFollowers(): Promise<FollowersResponse> {
  return apiRequest<FollowersResponse>(ApiRoutes.FOLLOW_ME_FOLLOWERS);
}

export async function getMyFollowing(): Promise<FollowingResponse> {
  return apiRequest<FollowingResponse>(ApiRoutes.FOLLOW_ME_FOLLOWING);
}

export async function getPendingFollowRequests(): Promise<PendingFollowRequestsResponse> {
  return apiRequest<PendingFollowRequestsResponse>(
    ApiRoutes.FOLLOW_ME_REQUESTS
  );
}

export async function approveFollowRequest(
  username: string
): Promise<ApproveFollowResponse> {
  return apiRequest<ApproveFollowResponse>(
    `${ApiRoutes.FOLLOW_APPROVE}/${username}`,
    { method: "POST" }
  );
}

export async function rejectFollowRequest(
  username: string
): Promise<RejectFollowResponse> {
  return apiRequest<RejectFollowResponse>(
    `${ApiRoutes.FOLLOW_REJECT}/${username}`,
    { method: "DELETE" }
  );
}

// ============================
// 4. Notifications
// ============================

export async function listNotifications(
  page = 0,
  size = 10
): Promise<ListNotificationsResponse> {
  return apiRequest<ListNotificationsResponse>(ApiRoutes.NOTIFICATIONS, {
    query: { page, size },
  });
}

export async function getUnreadNotificationsCount(): Promise<UnreadNotificationsCountResponse> {
  return apiRequest<UnreadNotificationsCountResponse>(
    ApiRoutes.NOTIFICATIONS_UNREAD_COUNT
  );
}

export async function markNotificationAsRead(id: string): Promise<void> {
  await apiRequest<void>(`${ApiRoutes.NOTIFICATIONS}/${id}/read`, {
    method: "POST",
    expect: "void",
  });
}

export async function markAllNotificationsAsRead(): Promise<void> {
  await apiRequest<void>(ApiRoutes.NOTIFICATIONS_READ_ALL, {
    method: "POST",
    expect: "void",
  });
}

// ============================
// 5. Public author entries
// ============================

export async function getUserEntriesForAuthorPage(
  username: string,
  page = 0,
  size = 20
): Promise<UserEntriesResponse> {
  // send auth header so backend can return FOLLOWERS_ONLY posts for approved followers
  return apiRequest<UserEntriesResponse>(
    `${ApiRoutes.ENTRIES_PUBLIC_USER}/${username}`,
    {
      query: { page, size },
      auth: true,
    }
  );
}

// ============================
// 6. Profile APIs
// ============================

export async function getMyProfile(): Promise<GetMyProfileResponse> {
  return apiRequest<GetMyProfileResponse>(ApiRoutes.PROFILE_ME);
}

export async function updateMyProfile(
  payload: { bio: string; profilePicture: string }
): Promise<UpdateMyProfileResponse> {
  return apiRequest<UpdateMyProfileResponse>(ApiRoutes.PROFILE_ME, {
    method: "PUT",
    body: payload,
  });
}

export async function getProfileByUsername(
  username: string
): Promise<GetProfileByUsernameResponse> {
  return apiRequest<GetProfileByUsernameResponse>(
    `${ApiRoutes.PROFILE}/${username}`
  );
}

export async function searchUsers(
  queryStr: string
): Promise<SearchUsersResponse> {
  return apiRequest<SearchUsersResponse>(ApiRoutes.PROFILE_SEARCH, {
    query: { query: queryStr },
  });
}

import { UserProfileResponse } from "@/types/api";

export async function getSuggestedUsers(): Promise<UserProfileResponse[]> {
  return apiRequest<UserProfileResponse[]>(
    "/api/public/users/suggested",
    { auth: true }
  );
}

