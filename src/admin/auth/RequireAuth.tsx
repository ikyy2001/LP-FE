import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth, isAdminRole } from "./auth-context";
import { getToken } from "../../lib/api";
import Spinner from "../components/Spinner";

// Middleware verifikasi role & status keaktifan user untuk rute /admin/* (mengacu pada VerifyAuthToken di BKK)
export default function RequireAuth() {
    const { status, user, verifySession } = useAuth();
    const [verifying, setVerifying] = useState(() => Boolean(getToken()));

    useEffect(() => {
        const token = getToken();
        if (!token) {
            return;
        }

        let isMounted = true;
        // Verifikasi sesi dan role setiap kali rute /admin/* dipasang/diakses
        verifySession().finally(() => {
            if (isMounted) {
                setVerifying(false);
            }
        });

        return () => {
            isMounted = false;
        };
    }, [verifySession]);

    // 1. Tampilkan spinner jika sedang memeriksa sesi
    if (verifying || status === "checking") {
        return (
            <div className="min-h-svh flex items-center justify-center bg-brand-softmist/50">
                <Spinner label="Memverifikasi izin akses..." className="w-8 h-8 text-brand-darkred" />
            </div>
        );
    }

    // 2. Token tidak ada atau sesi guest tanpa user yang terverifikasi
    const token = getToken();
    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    // 3. Status akun dinonaktifkan (sesuai aturan BKK VerifyAuthToken)
    if (user.status_aktif === false) {
        return <Navigate to="/login" replace />;
    }

    // 4. Verifikasi Role (RBAC):
    // Jika user login namun rolenya non-admin (misal: SISWA atau ALUMNI), alihkan ke portal /bkk/me
    if (!isAdminRole(user.role)) {
        window.location.replace("/bkk/me");
        return (
            <div className="min-h-svh flex items-center justify-center bg-brand-softmist/50">
                <Spinner label="Mengarahkan ke portal siswa..." className="w-8 h-8 text-brand-darkred" />
            </div>
        );
    }

    // 5. User lolos verifikasi autentikasi dan role admin yang sah
    return <Outlet />;
}
