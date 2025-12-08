// ================================
// Common / Shared Types
// ================================

export type Visibility = "PUBLIC" | "PRIVATE" | "FOLLOWERS_ONLY";

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

// ================================
// 1. Auth APIs (/api/auth/)
// ================================

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  expiresAt: number;
}

// ================================
// 2. Entries / Posts (/api/entries/)
// ================================

export interface EntryRequest {
  title: string;
  content: string;
  tags: string[];
  visibility: Visibility;
  imageUrls: string[];
}

export interface EntryResponse {
  id: string;
  title: string;
  content: string;
  tags: string[];
  visibility: Visibility;
  createdAt: string;
  updatedAt: string;
  imageUrls: string[];
  authorId: string;
  authorUsername: string;
  authorProfilePicture: string;
}

export type GetMyEntriesResponse = EntryResponse[];
export type PublicEntriesResponse = Page<EntryResponse>;
export type UserPublicEntriesResponse = Page<EntryResponse>;
export type SearchEntriesResponse = Page<EntryResponse>;
export type FeedEntriesResponse = Page<EntryResponse>;

// ================================
// 3. Follow / Social (/api/follow/)
// ================================

export interface SimpleMessageResponse {
  message: string;
}

export type SendFollowRequestResponse = SimpleMessageResponse;
export type UnfollowResponse = SimpleMessageResponse;
export type FollowersResponse = string[];
export type FollowingResponse = string[];
export type PendingFollowRequestsResponse = string[];
export type ApproveFollowResponse = SimpleMessageResponse;
export type RejectFollowResponse = SimpleMessageResponse;

// ================================
// 4. Notifications (/api/notifications/)
// ================================

export type NotificationType = "FOLLOW_REQUEST" | "FOLLOW_APPROVED";

export interface NotificationResponse {
  id: string;
  recipientUsername: string;
  actorUsername: string;
  type: NotificationType;
  message: string;
  read: boolean;
  createdAt: string;
}

export type ListNotificationsResponse = Page<NotificationResponse>;
export type UnreadNotificationsCountResponse = number;

// ================================
// 5. User Profile (/api/profile/)
// ================================

export interface UserProfileResponse {
  id: string;
  username: string;
  bio: string | null;
  profilePicture: string | null;
  joinedAt: string;
}

export interface UserProfileRequest {
  bio: string;
  profilePicture: string;
}

export type GetMyProfileResponse = UserProfileResponse;
export type UpdateMyProfileResponse = UserProfileResponse;
export type GetProfileByUsernameResponse = UserProfileResponse;
export type SearchUsersResponse = UserProfileResponse[];
export type UserEntriesResponse = Page<EntryResponse>;

// ================================
// API Routes
// ================================

export enum ApiRoutes {
  REGISTER = "/api/auth/register",
  LOGIN = "/api/auth/login",
  ENTRIES = "/api/entries",
  ENTRIES_PUBLIC = "/api/entries/public",
  ENTRIES_PUBLIC_USER = "/api/entries/public/user",
  ENTRIES_FEED = "/api/entries/feed",
  ENTRIES_PUBLIC_SEARCH = "/api/entries/public/search",
  FOLLOW = "/api/follow",
  FOLLOW_ME_FOLLOWERS = "/api/follow/me/followers",
  FOLLOW_ME_FOLLOWING = "/api/follow/me/following",
  FOLLOW_ME_REQUESTS = "/api/follow/me/requests",
  FOLLOW_APPROVE = "/api/follow/approve",
  FOLLOW_REJECT = "/api/follow/reject",
  NOTIFICATIONS = "/api/notifications",
  NOTIFICATIONS_UNREAD_COUNT = "/api/notifications/unread-count",
  NOTIFICATIONS_READ_ALL = "/api/notifications/read-all",
  USERS_ENTRIES = "/api/users",
  PROFILE_ME = "/api/profile/me",
  PROFILE = "/api/profile",
  PROFILE_SEARCH = "/api/profile/search"
}
