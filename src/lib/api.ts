/**
 * API utility – all requests to Google Apps Script backend.
 *
 * GAS Web App requires Content-Type: text/plain to avoid CORS preflight.
 * The GAS backend parses the body with JSON.parse(e.postData.contents).
 */

const GAS_URL = import.meta.env.VITE_GAS_URL as string;

async function post<T>(payload: Record<string, unknown>): Promise<T> {
  const response = await fetch(GAS_URL, {
    method: "POST",
    // text/plain avoids CORS preflight – critical for GAS
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify(payload),
    redirect: "follow",
  });

  if (!response.ok) {
    throw new Error(`Network error: ${response.status}`);
  }

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message ?? "An unknown error occurred.");
  }
  return data as T;
}

// ─── Types ──────────────────────────────────────────────────────────────────

export interface UserMeta {
  slNo: number;
  firstName: string;
  lastName: string;
  usn: string;
  email: string;
  leetcodeUsername: string;
  totalSolved: number;
  percentage: number;
}

export interface LoginResponse {
  success: boolean;
  user: UserMeta;
  solvedArray: number[]; // 0 or 1, length 150
}

export interface LeaderboardEntry {
  rank: number;
  firstName: string;
  lastName: string;
  usn: string;
  leetcodeUsername: string;
  totalSolved: number;
  percentage: number;
}

// ─── Endpoints ───────────────────────────────────────────────────────────────




export async function apiLogin(payload: {
  usn: string;
  password: string; // already SHA-256 hashed
}): Promise<LoginResponse> {
  return post({ action: "login", ...payload });
}

export async function apiUpdateProgress(payload: {
  usn: string;
  password: string; // already SHA-256 hashed
  qNumber: number;  // 1-150
  status: 0 | 1;
}): Promise<{ success: boolean; totalSolved: number }> {
  return post({ action: "updateProgress", ...payload });
}

export async function apiGetLeaderboard(): Promise<{
  success: boolean;
  leaderboard: LeaderboardEntry[];
}> {
  const res = await post<{ success: boolean; leaderboard: LeaderboardEntry[] }>({ action: "getLeaderboard" });
  if (res.success && res.leaderboard) {
    let currentRank = 0;
    let prevSolved = -1;
    res.leaderboard.forEach((entry) => {
      if (entry.totalSolved !== prevSolved) {
        currentRank += 1; // Dense ranking (1, 2, 2, 3...)
        prevSolved = entry.totalSolved;
      }
      entry.rank = currentRank;
    });
  }
  return res;
}

export async function apiResetPassword(payload: {
  usn: string;
  email: string;
}): Promise<{ success: boolean; message: string }> {
  return post({ action: "resetPassword", ...payload });
}

export async function apiChangePassword(payload: {
  usn: string;
  oldPassword: string; // SHA-256 hashed
  newPassword: string; // SHA-256 hashed
}): Promise<{ success: boolean; message: string }> {
  return post({ action: "changePassword", ...payload });
}

export async function apiUpdateProfile(payload: {
  usn: string;
  password: string; // SHA-256 hashed
  leetcodeUsername: string;
}): Promise<{ success: boolean; message: string }> {
  return post({ action: "updateProfile", ...payload });
}

export async function apiSendOtp(payload: {
  firstName: string;
  lastName: string;
  usn: string;
  email: string;
  leetcodeUsername: string;
  password: string; // already SHA-256 hashed
}): Promise<{ success: boolean; message: string }> {
  return post({ action: "sendOtp", ...payload });
}

export async function apiVerifyOtp(payload: {
  usn: string;
  otp: string;
}): Promise<{ success: boolean; message: string }> {
  return post({ action: "verifyOtp", ...payload });
}

export interface EditRequest {
  timestamp: number;
  usn: string;
  reason: string;
  fieldsToChange: string;
}

export async function apiSubmitEditRequest(payload: {
  usn: string;
  password: string; // SHA-256 hashed
  reason: string;
  fieldsToChange: string;
}): Promise<{ success: boolean; message: string }> {
  return post({ action: "submitEditRequest", ...payload });
}

export async function apiGetEditRequests(payload: {
  adminPassword: string;
}): Promise<{ success: boolean; requests: EditRequest[] }> {
  return post({ action: "getEditRequests", ...payload });
}

export async function apiDeleteEditRequest(payload: {
  adminPassword: string;
  timestamp: number;
  usn: string;
}): Promise<{ success: boolean; message: string }> {
  return post({ action: "deleteEditRequest", ...payload });
}

export async function apiGetAllUsers(payload: {
  adminPassword: string;
}): Promise<{ success: boolean; users: UserMeta[] }> {
  return post({ action: "getAllUsers", ...payload });
}

export async function apiGetUserProgress(payload: {
  adminPassword: string;
  usn: string;
}): Promise<{ success: boolean; solvedArray: number[] }> {
  return post({ action: "getUserProgress", ...payload });
}

export async function apiRemoveUser(payload: {
  adminPassword: string;
  usn: string;
}): Promise<{ success: boolean; message: string }> {
  return post({ action: "removeUser", ...payload });
}

export interface UserWithProgress extends UserMeta {
  solvedArray: number[];
}

export async function apiGetAllUsersProgress(payload: {
  adminPassword: string;
}): Promise<{ success: boolean; users: UserWithProgress[] }> {
  return post({ action: "getAllUsersProgress", ...payload });
}
