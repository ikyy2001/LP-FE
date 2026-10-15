import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../pages/home/Home";
import About from "../pages/about/About";
import MajorDetail from "../pages/majors/MajorDetail";
import Teachers from "../pages/teachers/Teachers";
import TeacherDetail from "../pages/teachers/TeacherDetail";
import Facilities from "../pages/facilities/Facilities";
import News from "../pages/news/News";
import NewsDetail from "../pages/news/NewsDetail";
import ProgramDetail from "../pages/programs/ProgramDetail";
import Activities from "../pages/activities/Activities";
import ActivityDetail from "../pages/activities/ActivityDetail";
import LoginPage from "../pages/login/LoginPage";
import NotFound from "../pages/notfound/NotFound";
import AdminLoadingScreen from "../admin/components/AdminLoadingScreen";
import { loadAdminApp } from "../admin/loadAdminApp";

// Panel admin dimuat terpisah, jadi pengunjung situs tidak ikut mengunduh kodenya
const AdminApp = lazy(loadAdminApp);

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/tentang" element={<About />} />
      <Route path="/profil-guru" element={<Teachers />} />
      <Route path="/profil-guru/:id" element={<TeacherDetail />} />
      <Route path="/fasilitas" element={<Facilities />} />
      <Route path="/jurusan/:slug" element={<MajorDetail />} />
      <Route path="/berita" element={<News />} />
      <Route path="/berita/:slug" element={<NewsDetail />} />
      <Route path="/program/:slug" element={<ProgramDetail />} />
      <Route path="/kegiatan" element={<Activities />} />
      <Route path="/kegiatan/:slug" element={<ActivityDetail />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/admin/*"
        element={
          <Suspense fallback={<AdminLoadingScreen />}>
            <AdminApp />
          </Suspense>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
