import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/auth-context";
import AdminIcon from "../components/AdminIcon";
import PanelState from "../components/PanelState";
import StatusBadge from "../components/StatusBadge";
import Thumbnail from "../components/Thumbnail";
import { formatDateTime, useDocumentTitle } from "../lib/format";
import { newsCategories, type News } from "../../data/news";
import type { Resource } from "../../lib/api";
import { useApi } from "../../lib/useApi";

type Dashboard = {
    news: { total: number; published: number; scheduled: number; draft: number };
    programs: number;
    facilities: number;
    recent_news: News[];
};

export default function DashboardPage() {
    useDocumentTitle("Dashboard Utama");
    const { user } = useAuth();
    const navigate = useNavigate();
    const { data, error, reload } = useApi<Resource<Dashboard>>("/admin/dashboard");
    const stats = data?.data;

    // Filter bar state
    const [searchQuery, setSearchQuery] = useState("");
    const [filterCategory, setFilterCategory] = useState("");
    const [filterStatus, setFilterStatus] = useState("");

    const handleFilterSubmit = (e: FormEvent) => {
        e.preventDefault();
        const searchParams = new URLSearchParams();
        if (searchQuery.trim()) searchParams.set("search", searchQuery.trim());
        if (filterCategory) searchParams.set("category", filterCategory);
        if (filterStatus) searchParams.set("status", filterStatus);
        navigate(`/admin/berita?${searchParams.toString()}`);
    };

    const totalNews = stats?.news.total ?? 0;
    const publishedNews = stats?.news.published ?? 0;
    const draftNews = stats?.news.draft ?? 0;
    const publishedRate = totalNews > 0 ? Math.round((publishedNews / totalNews) * 100) : 0;
    const draftRate = totalNews > 0 ? Math.round((draftNews / totalNews) * 100) : 0;

    return (
        <div className="space-y-5">
            {/* SUB-NAVIGATION BAR & ACTION CTAS */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-3 sm:p-3.5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
                {/* Sub-tabs */}
                <div className="flex items-center flex-wrap gap-1.5">
                    <Link
                        to="/admin"
                        className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#1E293B] text-white shadow-sm transition-all"
                    >
                        Overview
                    </Link>
                    <Link
                        to="/admin/berita"
                        className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                    >
                        Berita Sekolah
                    </Link>
                    <Link
                        to="/admin/program"
                        className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                    >
                        Program Unggulan
                    </Link>
                    <Link
                        to="/admin/talent-day"
                        className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                    >
                        Talent Day
                    </Link>
                    <Link
                        to="/admin/ekskul"
                        className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                    >
                        Ekstrakurikuler
                    </Link>
                    <Link
                        to="/admin/fasilitas"
                        className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                    >
                        Fasilitas Sarana
                    </Link>
                    <Link
                        to="/admin/akun"
                        className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                    >
                        Pengaturan Akun
                    </Link>
                    <a
                        href="/"
                        target="_blank"
                        rel="noreferrer"
                        className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center gap-1"
                    >
                        <span>Lihat Publik</span>
                        <AdminIcon name="external" className="w-3 h-3" />
                    </a>
                </div>

                {/* Action CTAs */}
                <div className="flex items-center gap-2.5">
                    <button
                        type="button"
                        onClick={() => window.print()}
                        className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                        <AdminIcon name="printer" className="w-3.5 h-3.5 text-[#8B1D24]" />
                        <span>Cetak Ringkasan</span>
                    </button>

                    <Link
                        to="/admin/berita/baru"
                        className="px-4 py-2 rounded-xl bg-[#8B1D24] hover:bg-[#72151B] text-white text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm"
                    >
                        <AdminIcon name="plus" className="w-3.5 h-3.5" />
                        <span>Tulis Berita</span>
                    </Link>
                </div>
            </div>

            {!stats ? (
                <PanelState error={error} onRetry={reload} label="Memuat ringkasan dasbor" />
            ) : (
                <>
                    {/* WELCOME HERO BANNER */}
                    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-sm relative overflow-hidden">
                        {/* Decorative background glows */}
                        <div className="absolute -right-16 -top-16 w-64 h-64 bg-red-50/60 rounded-full blur-3xl pointer-events-none" />
                        <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-slate-100/60 rounded-full blur-3xl pointer-events-none" />

                        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                            {/* Left Info & Greeting */}
                            <div className="max-w-2xl">
                                <div className="flex items-center gap-2.5 mb-2.5">
                                    <span className="px-3 py-1 rounded-full bg-[#1E293B] text-white text-xs font-semibold shadow-xs">
                                        Administrator Sekolah
                                    </span>
                                    <span className="text-xs font-medium text-slate-500">
                                        SMK Plus Pelita Nusantara Bogor
                                    </span>
                                </div>
                                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
                                    Halo, {user?.name ?? "Administrator"} 👋
                                </h1>
                                <p className="text-xs sm:text-sm text-[#64748B] mt-2 leading-relaxed">
                                    Selamat datang di panel kontrol landing page. Anda memiliki{" "}
                                    <span className="font-bold text-[#8B1D24]">{stats.news.draft} draf berita</span> yang
                                    belum dipublikasikan dan total{" "}
                                    <span className="font-bold text-slate-800">{stats.news.total} konten berita</span> aktif
                                    di situs sekolah.
                                </p>
                            </div>

                            {/* Right Progress Widget */}
                            <div className="bg-slate-50/90 border border-slate-200/70 rounded-2xl p-4 sm:p-5 sm:min-w-[280px] shadow-2xs flex flex-col justify-between">
                                <div className="flex items-center justify-between gap-3 mb-2">
                                    <span className="text-xs font-semibold text-slate-700">Rasio Publikasi Berita</span>
                                    <span className="text-sm font-extrabold text-[#0F172A]">{publishedRate}%</span>
                                </div>

                                {/* Thin Maroon Progress Bar with Rounded Ends */}
                                <div className="w-full bg-slate-200/80 h-2 rounded-full overflow-hidden my-1">
                                    <div
                                        className="bg-[#8B1D24] h-full rounded-full transition-all duration-500"
                                        style={{ width: `${publishedRate}%` }}
                                    />
                                </div>

                                <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between">
                                    <Link
                                        to="/admin/berita"
                                        className="text-xs font-bold text-[#8B1D24] hover:text-[#72151B] inline-flex items-center gap-1 transition-colors"
                                    >
                                        <span>Kelola berita sekarang</span>
                                        <span>&rarr;</span>
                                    </Link>
                                    <span className="text-[10px] font-mono text-slate-400">
                                        {publishedNews}/{totalNews}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 4 METRIC COUNTERS GRID */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                        {/* 1. Total Berita */}
                        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Total Berita
                                </span>
                                <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shadow-xs">
                                    <AdminIcon name="news" className="w-4 h-4" />
                                </div>
                            </div>

                            <div className="my-2">
                                <div className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
                                    {stats.news.total}
                                </div>
                                <div className="text-xs text-slate-500 mt-1">Artikel & pembaruan berita</div>
                            </div>

                            <div className="flex items-end justify-between pt-3 border-t border-slate-100">
                                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                                    <AdminIcon name="trendingUp" className="w-3.5 h-3.5" />
                                    <span>+{stats.news.published} terbit</span>
                                </span>

                                {/* Mini Bar Representation (Slate/Navy) */}
                                <div className="flex items-end gap-1 h-6">
                                    <span className="w-1.5 bg-slate-200 rounded-full h-2.5" />
                                    <span className="w-1.5 bg-slate-300 rounded-full h-4" />
                                    <span className="w-1.5 bg-slate-300 rounded-full h-3" />
                                    <span className="w-1.5 bg-slate-400 rounded-full h-5" />
                                    <span className="w-1.5 bg-[#1E293B] rounded-full h-6" />
                                </div>
                            </div>
                        </div>

                        {/* 2. Draf Berita (Maroon Accent) */}
                        <div className="bg-white rounded-2xl border border-red-100 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-semibold uppercase tracking-wider text-[#8B1D24]">
                                    Draf Berita
                                </span>
                                <div className="w-9 h-9 rounded-xl bg-[#8B1D24] text-white flex items-center justify-center shadow-xs">
                                    <AdminIcon name="pencil" className="w-4 h-4" />
                                </div>
                            </div>

                            <div className="my-2">
                                <div className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
                                    {stats.news.draft}
                                </div>
                                <div className="text-xs text-slate-500 mt-1">Belum dipublikasikan ke situs</div>
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-red-50">
                                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                                    Perlu Tindakan
                                </span>
                                <Link
                                    to="/admin/berita?status=draft"
                                    className="text-xs font-bold text-[#8B1D24] hover:underline flex items-center gap-0.5"
                                >
                                    <span>Review</span>
                                    <span>&rarr;</span>
                                </Link>
                            </div>
                        </div>

                        {/* 3. Program Unggulan */}
                        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Program Unggulan
                                </span>
                                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                    <AdminIcon name="star" className="w-4 h-4" />
                                </div>
                            </div>

                            <div className="my-2">
                                <div className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
                                    {stats.programs}
                                </div>
                                {/* Dual Color Progress Bar (Navy to Maroon) */}
                                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-2">
                                    <div className="bg-gradient-to-r from-[#1E293B] to-[#8B1D24] h-full rounded-full w-full" />
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500">
                                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    Tampil di Beranda
                                </span>
                                <Link to="/admin/program" className="font-bold text-[#8B1D24] hover:underline">
                                    Kelola &rarr;
                                </Link>
                            </div>
                        </div>

                        {/* 4. Sarana & Fasilitas */}
                        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Fasilitas Sarana
                                </span>
                                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                    <AdminIcon name="building" className="w-4 h-4" />
                                </div>
                            </div>

                            <div className="my-2">
                                <div className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
                                    {stats.facilities}
                                </div>
                                <div className="text-xs text-slate-500 mt-1">Ruang lab & bengkel praktik</div>
                            </div>

                            <div className="flex items-end justify-between pt-3 border-t border-slate-100">
                                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                                    Galeri Fasilitas
                                </span>

                                {/* Mini Bar Representation (Maroon Tones) */}
                                <div className="flex items-end gap-1 h-6">
                                    <span className="w-1.5 bg-red-200 rounded-full h-2" />
                                    <span className="w-1.5 bg-red-300 rounded-full h-3" />
                                    <span className="w-1.5 bg-red-400 rounded-full h-4" />
                                    <span className="w-1.5 bg-[#8B1D24]/80 rounded-full h-5" />
                                    <span className="w-1.5 bg-[#8B1D24] rounded-full h-6" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* QUICK SEARCH & FILTER BAR */}
                    <div className="bg-white rounded-2xl border border-slate-200/80 p-3 sm:p-4 shadow-sm">
                        <form onSubmit={handleFilterSubmit} className="flex flex-col sm:flex-row gap-2.5">
                            <div className="flex-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                    <AdminIcon name="search" className="w-4 h-4" />
                                </div>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Cari judul atau isi berita..."
                                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#F1F5F9] border-0 text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-300 focus:outline-none transition-all"
                                />
                            </div>

                            <select
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value)}
                                className="px-4 py-2.5 rounded-xl bg-[#F1F5F9] border-0 text-xs text-slate-700 font-medium focus:bg-white focus:ring-2 focus:ring-slate-300 focus:outline-none cursor-pointer"
                            >
                                <option value="">Semua Kategori</option>
                                {newsCategories.map((c) => (
                                    <option key={c} value={c}>
                                        {c}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="px-4 py-2.5 rounded-xl bg-[#F1F5F9] border-0 text-xs text-slate-700 font-medium focus:bg-white focus:ring-2 focus:ring-slate-300 focus:outline-none cursor-pointer"
                            >
                                <option value="">Semua Status</option>
                                <option value="published">Terbit</option>
                                <option value="scheduled">Terjadwal</option>
                                <option value="draft">Draf</option>
                            </select>

                            <button
                                type="submit"
                                className="px-5 py-2.5 rounded-xl bg-[#1E293B] hover:bg-slate-800 text-white text-xs font-semibold transition-all cursor-pointer shrink-0 shadow-sm flex items-center justify-center gap-1.5"
                            >
                                <AdminIcon name="filter" className="w-3.5 h-3.5" />
                                <span>Filter Berita</span>
                            </button>
                        </form>
                    </div>

                    {/* TWO COLUMN HIGH-DENSITY SECTION: RECENT NEWS & CONTENT DISTRIBUTION */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                        {/* LEFT COLUMN (7 COLS): RECENT NEWS TABLE */}
                        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col">
                            {/* Table Header Strip */}
                            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                                <div>
                                    <h2 className="font-extrabold text-base text-[#0F172A] tracking-tight">
                                        Berita Terakhir Diubah
                                    </h2>
                                    <p className="text-xs text-slate-500 mt-0.5">Artikel dan publikasi terbaru di situs</p>
                                </div>
                                <Link
                                    to="/admin/berita"
                                    className="text-xs font-bold text-[#8B1D24] hover:text-[#72151B] flex items-center gap-1 transition-colors"
                                >
                                    <span>Lihat Semua ({stats.news.total})</span>
                                    <span>&rarr;</span>
                                </Link>
                            </div>

                            {/* Table Container */}
                            <div className="overflow-x-auto flex-1">
                                <table className="w-full text-left text-xs border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50/80 border-b border-slate-100 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                                            <th className="py-3 px-4">Info Berita</th>
                                            <th className="py-3 px-4">Kategori</th>
                                            <th className="py-3 px-4">Tanggal</th>
                                            <th className="py-3 px-4">Status</th>
                                            <th className="py-3 px-4 text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {stats.recent_news.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="py-10 text-center text-xs text-slate-400">
                                                    Belum ada artikel berita yang dibuat.
                                                </td>
                                            </tr>
                                        ) : (
                                            stats.recent_news.map((item) => (
                                                <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                                                    <td className="py-3 px-4">
                                                        <div className="flex items-center gap-3">
                                                            <Thumbnail src={item.image} className="h-10 w-12 rounded-lg" />
                                                            <div className="min-w-0 max-w-[200px] sm:max-w-xs">
                                                                <Link
                                                                    to={`/admin/berita/${item.id}`}
                                                                    className="font-bold text-slate-900 text-xs hover:text-[#8B1D24] transition-colors truncate block"
                                                                    title={item.title}
                                                                >
                                                                    {item.title}
                                                                </Link>
                                                                <p className="text-[11px] text-slate-400 truncate">
                                                                    {item.excerpt || "Tidak ada ringkasan"}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4 whitespace-nowrap">
                                                        <span className="font-semibold text-slate-700 text-xs">
                                                            {item.category}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4 whitespace-nowrap text-slate-500 text-[11px]">
                                                        {formatDateTime(item.date)}
                                                    </td>
                                                    <td className="py-3 px-4 whitespace-nowrap">
                                                        <StatusBadge status={item.status} />
                                                    </td>
                                                    <td className="py-3 px-4 text-right whitespace-nowrap">
                                                        <Link
                                                            to={`/admin/berita/${item.id}`}
                                                            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-[#1E293B] hover:text-white text-slate-700 transition-colors inline-block"
                                                        >
                                                            Detail / Edit
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Table Footer */}
                            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs">
                                <span className="text-slate-500">
                                    Menampilkan {stats.recent_news.length} berita terakhir diubah
                                </span>
                                <Link
                                    to="/admin/berita"
                                    className="font-bold text-[#8B1D24] hover:underline flex items-center gap-1"
                                >
                                    <span>Buka Semua Berita</span>
                                    <span>&rarr;</span>
                                </Link>
                            </div>
                        </div>

                        {/* RIGHT COLUMN (5 COLS): DISTRIBUSI KONTEN & AKSES CEPAT */}
                        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col">
                            {/* Header Strip */}
                            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                                <div>
                                    <h2 className="font-extrabold text-base text-[#0F172A] tracking-tight">
                                        Distribusi Konten
                                    </h2>
                                    <p className="text-xs text-slate-500 mt-0.5">Sebaran dan status konten portal</p>
                                </div>
                                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-semibold">
                                    Live CMS
                                </span>
                            </div>

                            {/* Content Breakdown List */}
                            <div className="p-4 space-y-4 flex-1">
                                {/* Bar 1: Berita Terbit */}
                                <div>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-xs text-slate-800">Berita Terbit</span>
                                            <span className="text-[11px] text-slate-400">Tampil untuk umum</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="font-mono font-bold text-xs text-[#8B1D24]">
                                                {publishedNews}
                                            </span>
                                            <span className="text-[11px] text-slate-400"> / {totalNews}</span>
                                        </div>
                                    </div>
                                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                        <div
                                            className="bg-gradient-to-r from-[#8B1D24] to-[#A11B24] h-full rounded-full transition-all duration-300"
                                            style={{ width: `${publishedRate}%` }}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                                        <span>{publishedRate}% telah dipublikasikan</span>
                                        <span>Status: Aktif</span>
                                    </div>
                                </div>

                                {/* Bar 2: Draf Berita */}
                                <div>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-xs text-slate-800">Draf Berita</span>
                                            <span className="text-[11px] text-slate-400">Belum dipublikasikan</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="font-mono font-bold text-xs text-amber-600">{draftNews}</span>
                                            <span className="text-[11px] text-slate-400"> / {totalNews}</span>
                                        </div>
                                    </div>
                                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                        <div
                                            className="bg-amber-400 h-full rounded-full transition-all duration-300"
                                            style={{ width: `${draftRate}%` }}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                                        <span>{draftRate}% berupa draf</span>
                                        <span>Perlu review</span>
                                    </div>
                                </div>

                                {/* Quick Action Tiles */}
                                <div className="pt-2 border-t border-slate-100">
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2.5">
                                        AKSI CEPAT TAMBAH KONTEN
                                    </span>
                                    <div className="grid gap-2">
                                        <Link
                                            to="/admin/berita/baru"
                                            className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-100 text-xs font-semibold text-slate-800 transition-colors"
                                        >
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-7 h-7 rounded-lg bg-red-50 text-[#8B1D24] flex items-center justify-center">
                                                    <AdminIcon name="news" className="w-3.5 h-3.5" />
                                                </div>
                                                <span>Tulis Berita Baru</span>
                                            </div>
                                            <AdminIcon name="chevronRight" className="w-3.5 h-3.5 text-slate-400" />
                                        </Link>

                                        <Link
                                            to="/admin/program/baru"
                                            className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-100 text-xs font-semibold text-slate-800 transition-colors"
                                        >
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                                    <AdminIcon name="star" className="w-3.5 h-3.5" />
                                                </div>
                                                <span>Tambah Program Unggulan</span>
                                            </div>
                                            <AdminIcon name="chevronRight" className="w-3.5 h-3.5 text-slate-400" />
                                        </Link>

                                        <Link
                                            to="/admin/fasilitas/baru"
                                            className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-100 text-xs font-semibold text-slate-800 transition-colors"
                                        >
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                                                    <AdminIcon name="building" className="w-3.5 h-3.5" />
                                                </div>
                                                <span>Tambah Fasilitas Sekolah</span>
                                            </div>
                                            <AdminIcon name="chevronRight" className="w-3.5 h-3.5 text-slate-400" />
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Footer Action */}
                            <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                                <Link
                                    to="/admin/akun"
                                    className="text-xs font-semibold text-[#8B1D24] hover:underline flex items-center justify-between"
                                >
                                    <span>Kelola Profil & Pengaturan Akun</span>
                                    <span>&rarr;</span>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* QUICK ADMIN GUIDE STRIP (SOP) */}
                    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm">
                        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                            <div>
                                <span className="font-extrabold text-sm text-[#0F172A] tracking-tight block">
                                    Alur Kerja Administrator Landing Page
                                </span>
                                <span className="text-xs text-slate-400">SMK Plus Pelita Nusantara Bogor</span>
                            </div>
                            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider">
                                SOP 2026/2027
                            </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-100">
                                <div className="flex items-center gap-2.5 mb-2">
                                    <span className="w-7 h-7 rounded-full bg-[#1E293B] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                                        1
                                    </span>
                                    <span className="font-bold text-xs text-slate-900">Tulis & Susun Konten</span>
                                </div>
                                <p className="text-xs text-slate-500 leading-relaxed">
                                    Buka menu Berita, Program, atau Fasilitas untuk menambahkan materi informasi baru dan
                                    mengunggah gambar resolusi tinggi.
                                </p>
                            </div>
                            <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-100">
                                <div className="flex items-center gap-2.5 mb-2">
                                    <span className="w-7 h-7 rounded-full bg-[#8B1D24] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                                        2
                                    </span>
                                    <span className="font-bold text-xs text-slate-900">Atur Status Publikasi</span>
                                </div>
                                <p className="text-xs text-slate-500 leading-relaxed">
                                    Simpan sebagai Draf untuk meninjau pratinjau terlebih dahulu, atau langsung Terbitkan
                                    dengan tanggal terbit yang ditentukan.
                                </p>
                            </div>
                            <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-100">
                                <div className="flex items-center gap-2.5 mb-2">
                                    <span className="w-7 h-7 rounded-full bg-[#1E293B] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                                        3
                                    </span>
                                    <span className="font-bold text-xs text-slate-900">Periksa Tampilan Publik</span>
                                </div>
                                <p className="text-xs text-slate-500 leading-relaxed">
                                    Kunjungi portal publik sekolah untuk memastikan tampilan berita, kartu fasilitas, dan
                                    program unggulan telah tampil sempurna.
                                </p>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
