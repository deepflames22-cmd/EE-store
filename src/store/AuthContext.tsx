import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type User = {
  name: string;
  email: string;
  created: string;
  prefs: { newsletter: boolean; sms: boolean };
};

type StoredUser = User & { pass: string };

type AuthCtx = {
  user: User | null;
  login: (email: string, pass: string) => string | null;
  signup: (name: string, email: string, pass: string) => string | null;
  logout: () => void;
  update: (patch: Partial<User>) => void;
  memberNo: string;
};

const USERS_KEY = "aurion-users-v1";
const SESSION_KEY = "aurion-session-v1";

const Ctx = createContext<AuthCtx | null>(null);

function loadUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? (JSON.parse(raw) as StoredUser[]) : [];
  } catch {
    return [];
  }
}

function saveUsers(users: StoredUser[]) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch {
    /* storage unavailable */
  }
}

function memberFrom(email: string) {
  let h = 0;
  for (let i = 0; i < email.length; i++) h = (h * 31 + email.charCodeAt(i)) >>> 0;
  return String((h % 4000) + 1000).padStart(4, "0");
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const email = localStorage.getItem(SESSION_KEY);
      if (!email) return null;
      const found = loadUsers().find((u) => u.email === email);
      if (!found) return null;
      const { pass: _p, ...rest } = found;
      return rest;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (user) localStorage.setItem(SESSION_KEY, user.email);
      else localStorage.removeItem(SESSION_KEY);
    } catch {
      /* noop */
    }
  }, [user]);

  const login = useCallback((email: string, pass: string): string | null => {
    const normalized = email.trim().toLowerCase();
    const found = loadUsers().find((u) => u.email === normalized);
    if (!found) return "No member found under that address.";
    if (found.pass !== pass) return "That pass-phrase does not match.";
    const { pass: _p, ...rest } = found;
    setUser(rest);
    return null;
  }, []);

  const signup = useCallback((name: string, email: string, pass: string): string | null => {
    const normalized = email.trim().toLowerCase();
    const users = loadUsers();
    if (users.some((u) => u.email === normalized)) return "That address is already in the register.";
    const stored: StoredUser = {
      name: name.trim(),
      email: normalized,
      pass,
      created: new Date().toISOString(),
      prefs: { newsletter: true, sms: false },
    };
    saveUsers([...users, stored]);
    const { pass: _p, ...rest } = stored;
    setUser(rest);
    return null;
  }, []);

  const logout = useCallback(() => setUser(null), []);

  const update = useCallback((patch: Partial<User>) => {
    setUser((u) => {
      if (!u) return u;
      const next = { ...u, ...patch, email: u.email };
      const users = loadUsers().map((s) => (s.email === u.email ? { ...s, ...patch, email: u.email } : s));
      saveUsers(users);
      return next;
    });
  }, []);

  const value = useMemo<AuthCtx>(
    () => ({ user, login, signup, logout, update, memberNo: user ? memberFrom(user.email) : "----" }),
    [user, login, signup, logout, update]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
