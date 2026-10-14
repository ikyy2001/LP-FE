import { useEffect, useState, type ReactNode } from "react";
import { AuthContext, type AdminUser, type AuthStatus } from "./auth-context";
import { ApiError, apiRequest, getToken, onUnauthorized, setToken } from "../../lib/api";
import { invalidateApiCache } from "../../lib/useApi";

type LoginApiResponse = {
    success: boolean;
    message: string;
    access_token: string;
    token_type: string;
    expires_in: string;
};

type VerifyApiResponse = {
    success: boolean;
    message: string;
    data: AdminUser;
};

const ALLOWED_ADMIN_ROLES = ["ADMIN", "KEPALA_SEKOLAH", "TU"];

export default function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AdminUser | null>(null);
    const [status, setStatus] = useState<AuthStatus>(() => (getToken() ? "checking" : "guest"));

    // Periksa token tersimpan saat panel admin dibuka
    useEffect(() => {
        const token = getToken();
        if (!token) return;

        let cancelled = false;
        apiRequest<VerifyApiResponse>("/user/verify", {
            method: "POST",
            body: { access_token: token },
        }).then(
            (response) => {
                if (cancelled) return;
                const userData = response.data;
                const role = (userData.role || "").toUpperCase();

                if (!ALLOWED_ADMIN_ROLES.includes(role)) {
                    setToken(null);
                    setUser(null);
                    setStatus("guest");
                    return;
                }

                setUser({ ...userData, name: userData.nama_lengkap || userData.username });
                setStatus("authenticated");
            },
            () => {
                if (cancelled) return;
                setToken(null);
                setUser(null);
                setStatus("guest");
            },
        );

        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => onUnauthorized(() => {
        setToken(null);
        setUser(null);
        setStatus("guest");
        invalidateApiCache("/admin");
    }), []);

    const login = async (username: string, password: string) => {
        // 1. Panggil microservice login (/api/user/login)
        const loginRes = await apiRequest<LoginApiResponse>("/user/login", {
            method: "POST",
            body: { username, password },
        });

        const token = loginRes.access_token;
        setToken(token, loginRes.expires_in);

        // Ekstraksi payload JWT untuk data sesi
        let jwtUser: Partial<AdminUser> | null = null;
        try {
            const parts = token.split(".");
            if (parts.length === 3) {
                const payloadJson = atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"));
                jwtUser = JSON.parse(payloadJson);
            }
        } catch {
            // Abaikan kesalahan pembacaan payload JWT
        }

        try {
            // 2. Verifikasi token dan peroleh data profil pengguna
            const verifyRes = await apiRequest<VerifyApiResponse>("/user/verify", {
                method: "POST",
                body: { access_token: token },
            });

            const userData = verifyRes.data;
            const role = (userData.role || "").toUpperCase();

            // 3. Validasi hak akses role (ADMIN, KEPALA_SEKOLAH, TU)
            if (!ALLOWED_ADMIN_ROLES.includes(role)) {
                setToken(null);
                throw new ApiError(
                    403,
                    `Akses ditolak: role ${userData.role} tidak memiliki izin untuk mengakses panel administrator.`,
                );
            }

            setUser({ ...userData, name: userData.nama_lengkap || userData.username });
            setStatus("authenticated");
        } catch (error) {
            if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
                setToken(null);
                setUser(null);
                setStatus("guest");
                throw error;
            }

            // Fallback: jika verify tidak terhubung namun JWT memiliki role admin
            if (jwtUser && jwtUser.role) {
                const role = String(jwtUser.role).toUpperCase();
                if (!ALLOWED_ADMIN_ROLES.includes(role)) {
                    setToken(null);
                    setUser(null);
                    setStatus("guest");
                    throw new ApiError(
                        403,
                        `Akses ditolak: role ${jwtUser.role} tidak memiliki izin untuk mengakses panel administrator.`,
                    );
                }

                setUser({
                    id: jwtUser.id ?? "admin",
                    username: jwtUser.username ?? username,
                    nama_lengkap: (jwtUser as { nama_lengkap?: string }).nama_lengkap || jwtUser.username || username,
                    name: (jwtUser as { nama_lengkap?: string }).nama_lengkap || jwtUser.username || username,
                    role: role,
                    email: jwtUser.email ?? null,
                });
                setStatus("authenticated");
                return;
            }

            setToken(null);
            setUser(null);
            setStatus("guest");
            throw error;
        }
    };

    const logout = async () => {
        setToken(null);
        setUser(null);
        setStatus("guest");
        invalidateApiCache("/admin");
    };

    return (
        <AuthContext.Provider value={{ user, status, login, logout, setUser }}>
            {children}
        </AuthContext.Provider>
    );
}
