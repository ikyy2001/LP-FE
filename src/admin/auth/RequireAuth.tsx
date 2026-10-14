import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./auth-context";
import Spinner from "../components/Spinner";

// Halaman admin hanya untuk yang sudah masuk; selain itu diarahkan ke halaman masuk lalu kembali ke sini
export default function RequireAuth() {
    const { status } = useAuth();
    const location = useLocation();

    if (status === "checking") {
        return(
            <div className="min-h-svh flex items-center justify-center bg-brand-softmist/50">
                <Spinner label="Memeriksa sesi" className="w-8 h-8 text-brand-darkred" />
            </div>
        )
    }

    if (status === "guest") return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;

    return <Outlet />;
}
