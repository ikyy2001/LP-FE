import { useCallback, useEffect, useState, type ReactNode } from "react";
import { AuthContext, isAdminRole, type AdminUser, type AuthStatus } from "./auth-context";
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

async function fetchVerifyUser(token: string): Promise<AdminUser> {
    const response = await apiRequest<VerifyApiResponse>("/user/verify", {
        method: "POST",
        body: { access_token: token },
    });
    return response.data;
}

export default function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AdminUser | null>(null);
    const [status, setStatus] = useState<AuthStatus>(() => (getToken() ? "checking" : "guest"));

    // Fungsi verifikasi sesi ke microservice userapi (/api/user/verify)
    const verifySession = useCallback(async (): Promise<AdminUser | null> => {
        const token = getToken();
        if (!token) {
            return null;
        }

        try {
            const userData = await fetchVerifyUser(token);
            if (!userData || userData.status_aktif === false) {
                setToken(null);
                setUser(null);
                setStatus("guest");
                return null;
            }

            const formattedUser: AdminUser = {
                ...userData,
                name: userData.nama_lengkap || userData.username,
            };

            const role = (userData.role || "").toUpperCase();

            // Sesi non-admin (misal: siswa/alumni yang masuk portal BKK):
            // Token TIDAK dihapus agar sesi portal BKK tetap aktif, namun status admin menjadi "guest"
            // dan user tetap diset agar middleware dapat memeriksa role-nya untuk redirect ke /bkk/me
            setUser(formattedUser);
            if (!isAdminRole(role)) {
                setStatus("guest");
            } else {
                setStatus("authenticated");
            }

            return formattedUser;
        } catch {
            setToken(null);
            setUser(null);
            setStatus("guest");
            return null;
        }
    }, []);

    // Periksa token tersimpan saat aplikasi dibuka
    useEffect(() => {
        const token = getToken();
        if (!token) return;

        let cancelled = false;
        fetchVerifyUser(token).then(
            (userData) => {
                if (cancelled) return;
                if (!userData || userData.status_aktif === false) {
                    setToken(null);
                    setUser(null);
                    setStatus("guest");
                    return;
                }

                const formattedUser: AdminUser = {
                    ...userData,
                    name: userData.nama_lengkap || userData.username,
                };

                const role = (userData.role || "").toUpperCase();
                setUser(formattedUser);
                if (!isAdminRole(role)) {
                    setStatus("guest");
                } else {
                    setStatus("authenticated");
                }
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

    const login = async (username: string, password: string): Promise<AdminUser> => {
        // 1. Panggil microservice login (/api/user/login)
        const loginRes = await apiRequest<LoginApiResponse>("/user/login", {
            method: "POST",
            body: { username, password },
        });

        const token = loginRes.access_token;
        setToken(token, loginRes.expires_in);

        try {
            // 2. Verifikasi token dan peroleh data profil pengguna
            const verifyRes = await apiRequest<VerifyApiResponse>("/user/verify", {
                method: "POST",
                body: { access_token: token },
            });

            const userData = verifyRes.data;

            // Validasi akun aktif
            if (userData.status_aktif === false) {
                setToken(null);
                setUser(null);
                setStatus("guest");
                throw new ApiError(403, "Akun pengguna sedang dinonaktifkan.");
            }

            const formattedUser: AdminUser = {
                ...userData,
                name: userData.nama_lengkap || userData.username,
            };

            const role = (userData.role || "").toUpperCase();

            setUser(formattedUser);
            if (isAdminRole(role)) {
                setStatus("authenticated");
            } else {
                // Non-admin role: token tersimpan, status admin guest
                setStatus("guest");
            }

            return formattedUser;
        } catch (error) {
            if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
                setToken(null);
                setUser(null);
                setStatus("guest");
                throw error;
            }

            // Fallback: jika verify tidak terhubung namun JWT memiliki role
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

            if (jwtUser && jwtUser.role) {
                const role = String(jwtUser.role).toUpperCase();
                const fallbackUser: AdminUser = {
                    id: jwtUser.id ?? "admin",
                    username: jwtUser.username ?? username,
                    nama_lengkap: (jwtUser as { nama_lengkap?: string }).nama_lengkap || jwtUser.username || username,
                    name: (jwtUser as { nama_lengkap?: string }).nama_lengkap || jwtUser.username || username,
                    role,
                    email: jwtUser.email ?? null,
                    status_aktif: true,
                };
                setUser(fallbackUser);
                if (isAdminRole(role)) {
                    setStatus("authenticated");
                } else {
                    setStatus("guest");
                }
                return fallbackUser;
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
        <AuthContext.Provider value={{ user, status, login, logout, setUser, verifySession }}>
            {children}
        </AuthContext.Provider>
    );
}
