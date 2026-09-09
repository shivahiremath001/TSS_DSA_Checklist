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
  return post({ action: "getLeaderboard" });
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
