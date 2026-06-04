export interface JwtPayload {
  sub: string;
  email: string;
  name?: string;
  iat?: number;
  exp?: number;
}

// Decode JWT (không verify — chỉ đọc payload)
export function decodeToken(token: string): JwtPayload | null {
  try {
    const base64 = token.split(".")[1];
    const json = atob(base64.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export function getCurrentUser(): JwtPayload | null {
  const token = getToken();
  if (!token) return null;
  return decodeToken(token);
}

export function isLoggedIn(): boolean {
  const token = getToken();
  if (!token) return false;
  const payload = decodeToken(token);
  if (!payload) return false;
  // Kiểm tra token chưa hết hạn
  if (payload.exp && payload.exp * 1000 < Date.now()) {
    localStorage.removeItem("token");
    return false;
  }
  return true;
}

export function logout(): void {
  localStorage.removeItem("token");
  localStorage.removeItem("bookingId");
}
