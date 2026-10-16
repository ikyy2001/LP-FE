import { createContext, useContext } from "react";

export type AdminUser = {
    id: string | number;
    username: string;
    nama_lengkap: string;
    name?: string;
    nomor_induk?: string;
    role: "ADMIN" | "KEPALA_SEKOLAH" | "TU" | "DEVELOPER" | "GURU" | "SISWA" | "ORANG_TUA" | "BENDAHARA" | "BK" | string;
    email: string | null;
    no_hp?: string | null;
    jenis_kelamin?: "LAKI_LAKI" | "PEREMPUAN" | null;
    status_aktif?: boolean;
    foto_profil?: string | null;
    alamat?: string | null;
    createdAt?: string;
    updatedAt?: string;
};

export const ALLOWED_ADMIN_ROLES = ["ADMIN", "KEPALA_SEKOLAH", "TU", "DEVELOPER"] as const;
export type AdminRole = typeof ALLOWED_ADMIN_ROLES[number];

export function isAdminRole(role?: string | null): boolean {
    if (!role) return false;
    return (ALLOWED_ADMIN_ROLES as readonly string[]).includes(role.toUpperCase());
}

// checking = token tersimpan sedang diperiksa ke server saat panel admin pertama dibuka
export type AuthStatus = "checking" | "authenticated" | "guest";

export type AuthContextValue = {
    user: AdminUser | null;
    status: AuthStatus;
    login: (username: string, password: string) => Promise<AdminUser>;
    logout: () => Promise<void>;
    setUser: (user: AdminUser) => void;
    verifySession: () => Promise<AdminUser | null>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth harus dipakai di dalam AuthProvider");
    return context;
}
