import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./auth-context";
import AdminLoadingScreen from "../components/AdminLoadingScreen";

// Halaman admin hanya untuk yang sudah masuk; selain itu diarahkan ke halaman masuk.
export default function RequireAuth() {
    const { status } = useAuth();

    if (status === "checking") {
        return <AdminLoadingScreen message="Memeriksa sesi" />;
    }

    if (status === "guest") return <Navigate to="/login" replace />;

    return <Outlet />;
}
