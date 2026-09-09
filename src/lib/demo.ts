/**
 * Mock credentials for offline demo/testing.
 * USN: 2VD  |  Password: 2vd
 * Bypasses the GAS API entirely — logs in with fake data.
 */

import type { UserMeta } from "./api";

export const DEMO_USN      = "2VD";
export const DEMO_PASSWORD = "2vd";

export const DEMO_USER: UserMeta = {
  slNo:             1,
  firstName:        "Demo",
  lastName:         "User",
  usn:              "2VD",
  email:            "demo@thesoftwaresociety.dev",
  leetcodeUsername: "demo_coder",
  totalSolved:      0,
  percentage:       0,
};

/** 150-item array of zeros — all unsolved */
export const DEMO_SOLVED_ARRAY: number[] = Array(150).fill(0);
