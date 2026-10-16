import { Link, Navigate, Route, Routes } from "react-router-dom";
import RequireAuth from "./auth/RequireAuth";
import ToastProvider from "./toast/ToastProvider";
import AdminLayout from "./components/AdminLayout";
import PageHeader from "./components/PageHeader";
import { buttonPrimary } from "./components/ui";
import DashboardPage from "./pages/DashboardPage";
import NewsListPage from "./pages/news/NewsListPage";
import NewsFormPage from "./pages/news/NewsFormPage";
import ProgramListPage from "./pages/programs/ProgramListPage";
import ProgramFormPage from "./pages/programs/ProgramFormPage";
import FacilityListPage from "./pages/facilities/FacilityListPage";
import FacilityFormPage from "./pages/facilities/FacilityFormPage";
import ActivityListPage from "./pages/activities/ActivityListPage";
import ActivityFormPage from "./pages/activities/ActivityFormPage";
import AccountPage from "./pages/AccountPage";

// Panel admin di /admin. Dimuat terpisah (lazy) dari situs utama, jadi pengunjung tidak ikut mengunduh kodenya
export default function AdminApp() {
    return (
        <ToastProvider>
            <Routes>
                <Route path="login" element={<Navigate to="/login" replace />} />
                <Route element={<RequireAuth />}>
                    <Route element={<AdminLayout />}>
                        <Route index element={<DashboardPage />} />
                        <Route path="berita" element={<NewsListPage />} />
                        <Route path="berita/baru" element={<NewsFormPage />} />
                        <Route path="berita/:id" element={<NewsFormPage />} />
                        <Route path="program" element={<ProgramListPage />} />
                        <Route path="program/baru" element={<ProgramFormPage />} />
                        <Route path="program/:id" element={<ProgramFormPage />} />
                        <Route path="fasilitas" element={<FacilityListPage />} />
                        <Route path="fasilitas/baru" element={<FacilityFormPage />} />
                        <Route path="fasilitas/:id" element={<FacilityFormPage />} />
                        {/* key: pindah dari halaman Talent Day ke ekskul memasang ulang halamannya (isian form tidak terbawa) */}
                        <Route path="talent-day" element={<ActivityListPage key="talent_day" category="talent_day" />} />
                        <Route path="talent-day/baru" element={<ActivityFormPage key="talent_day" category="talent_day" />} />
                        <Route path="talent-day/:id" element={<ActivityFormPage key="talent_day" category="talent_day" />} />
                        <Route path="ekskul" element={<ActivityListPage key="ekskul" category="ekskul" />} />
                        <Route path="ekskul/baru" element={<ActivityFormPage key="ekskul" category="ekskul" />} />
                        <Route path="ekskul/:id" element={<ActivityFormPage key="ekskul" category="ekskul" />} />
                        <Route path="akun" element={<AccountPage />} />
                        <Route path="*" element={<AdminNotFound />} />
                    </Route>
                </Route>
            </Routes>
        </ToastProvider>
    );
}

function AdminNotFound() {
    return(
        <>
            <PageHeader title="Halaman Tidak Ditemukan" description="Halaman admin yang Anda cari tidak tersedia." />
            <Link to="/admin" className={buttonPrimary}>Kembali ke Dasbor</Link>
        </>
    )
}
