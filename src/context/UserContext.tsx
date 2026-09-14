import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { UserMeta } from "../lib/api";

// ─── Types ───────────────────────────────────────────────────────────────────

interface UserState {
  user: UserMeta | null;
  /** 150-length boolean array: true = solved */
  solvedArray: boolean[];
  /** SHA-256 hashed password – kept in memory for updateProgress calls */
  passwordHash: string;
  isAuthenticated: boolean;
}

interface UserContextValue extends UserState {
  login: (
    user: UserMeta,
    solvedArray: number[],
    passwordHash: string
  ) => void;
  logout: () => void;
  setSolved: (qIndex: number, solved: boolean) => void;
  setTotalSolved: (total: number) => void;
  setLeetcodeUsername: (username: string) => void;
  setProfileDetails: (firstName: string, lastName: string, leetcodeUsername: string) => void;
}

// ─── Context ─────────────────────────────────────────────────────────────────

const UserContext = createContext<UserContextValue | null>(null);

const STORAGE_KEY = "dsa_tracker_session";

const DEFAULT_STATE: UserState = {
  user: null,
  solvedArray: Array(150).fill(false),
  passwordHash: "",
  isAuthenticated: false,
};

// ─── Provider ────────────────────────────────────────────────────────────────

export function UserContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState<UserState>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as UserState;
        return parsed;
      }
    } catch {
      // ignore parse errors
    }
    return DEFAULT_STATE;
  });

  // Persist to localStorage on every state change
  useEffect(() => {
    if (state.isAuthenticated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [state]);

  const login = useCallback(
    (user: UserMeta, rawSolvedArray: number[], passwordHash: string) => {
      setState({
        user,
        solvedArray: rawSolvedArray.map((v) => v === 1),
        passwordHash,
        isAuthenticated: true,
      });
    },
    []
  );

  const logout = useCallback(() => {
    setState(DEFAULT_STATE);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const setSolved = useCallback((qIndex: number, solved: boolean) => {
    setState((prev) => {
      const newArr = [...prev.solvedArray];
      newArr[qIndex] = solved;
      const newTotal = newArr.filter(Boolean).length;
      return {
        ...prev,
        solvedArray: newArr,
        user: prev.user
          ? {
              ...prev.user,
              totalSolved: newTotal,
              percentage: parseFloat(((newTotal / 150) * 100).toFixed(1)),
            }
          : prev.user,
      };
    });
  }, []);

  const setTotalSolved = useCallback((total: number) => {
    setState((prev) => ({
      ...prev,
      user: prev.user
        ? {
            ...prev.user,
            totalSolved: total,
            percentage: parseFloat(((total / 150) * 100).toFixed(1)),
          }
        : prev.user,
    }));
  }, []);

  const setLeetcodeUsername = useCallback((username: string) => {
    setState((prev) => ({
      ...prev,
      user: prev.user ? { ...prev.user, leetcodeUsername: username } : prev.user,
    }));
  }, []);

  const setProfileDetails = useCallback((firstName: string, lastName: string, leetcodeUsername: string) => {
    setState((prev) => ({
      ...prev,
      user: prev.user ? { ...prev.user, firstName, lastName, leetcodeUsername } : prev.user,
    }));
  }, []);

  const value = useMemo<UserContextValue>(
    () => ({ ...state, login, logout, setSolved, setTotalSolved, setLeetcodeUsername, setProfileDetails }),
    [state, login, logout, setSolved, setTotalSolved, setLeetcodeUsername, setProfileDetails]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useUser(): UserContextValue {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error("useUser must be used inside <UserContextProvider>");
  }
  return ctx;
}
