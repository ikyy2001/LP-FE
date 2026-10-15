import { useEffect, useRef, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import AdminIcon, { type AdminIconName } from "./AdminIcon";
import { useAuth } from "../auth/auth-context";
import logoSekolah from "../../assets/images/logosmkpenus.webp";

type NavItem = {
    to: string;
    label: string;
    icon: AdminIconName;
    end?: boolean;
};

const contentNavItems: NavItem[] = [
    { to: "/admin", label: "Dashboard Utama", icon: "dashboard", end: true },
    { to: "/admin/berita", label: "Berita Sekolah", icon: "news" },
    { to: "/admin/program", label: "Program Unggulan", icon: "star" },
    { to: "/admin/talent-day", label: "Talent Day", icon: "sparkles" },
    { to: "/admin/ekskul", label: "Ekstrakurikuler", icon: "trophy" },
    { to: "/admin/fasilitas", label: "Fasilitas & Sarana", icon: "building" },
];

const settingNavItems: NavItem[] = [
    { to: "/admin/akun", label: "Akun & Keamanan", icon: "user" },
];

const portalNavItems: { href: string; label: string; icon: AdminIconName }[] = [
    { href: "/", label: "Beranda Utama", icon: "globe" },
    { href: "/berita", label: "Halaman Berita", icon: "news" },
    { href: "/fasilitas", label: "Halaman Fasilitas", icon: "building" },
    { href: "/kegiatan", label: "Halaman Kegiatan Siswa", icon: "trophy" },
];

type DashboardShortcutItem = {
    label: string;
    desc: string;
    href: string;
    icon: AdminIconName;
    isCurrent: boolean;
};

const dashboardShortcutItems: DashboardShortcutItem[] = [
    {
        href: "/admin",
        label: "CMS Portal Utama",
        desc: "Web & Konten",
        icon: "globe",
        isCurrent: true,
    },
    {
        href: "/bkk/admin",
        label: "Admin BKK",
        desc: "Bursa Kerja & Karir",
        icon: "briefcase",
        isCurrent: false,
    },
    {
        href: "/ppdb/dashboard",
        label: "Admin PPDB",
        desc: "Penerimaan Siswa",
        icon: "graduationCap",
        isCurrent: false,
    },
];

// Helper to determine active page title in the topbar
function getPageTitle(pathname: string): string {
    if (pathname === "/admin") return "Dashboard Utama";
    if (pathname.startsWith("/admin/berita")) {
        if (pathname.includes("/baru")) return "Tulis Berita Baru";
        return "Kelola Berita";
    }
    if (pathname.startsWith("/admin/program")) {
        if (pathname.includes("/baru")) return "Tambah Program Unggulan";
        return "Kelola Program Unggulan";
    }
    if (pathname.startsWith("/admin/talent-day")) {
        if (pathname.includes("/baru")) return "Tambah Talent Day";
        return "Kelola Talent Day";
    }
    if (pathname.startsWith("/admin/ekskul")) {
        if (pathname.includes("/baru")) return "Tambah Ekstrakurikuler";
        return "Kelola Ekstrakurikuler";
    }
    if (pathname.startsWith("/admin/fasilitas")) {
        if (pathname.includes("/baru")) return "Tambah Fasilitas";
        return "Kelola Fasilitas";
    }
    if (pathname.startsWith("/admin/akun")) return "Pengaturan Akun";
    return "Panel Admin";
}

export default function AdminLayout() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const { user, logout } = useAuth();
    const location = useLocation();

    const profileRef = useRef<HTMLDivElement>(null);
    const notifRef = useRef<HTMLDivElement>(null);

    const pageTitle = getPageTitle(location.pathname);

    // Initial for avatar
    const displayName = user?.nama_lengkap ?? user?.name ?? user?.username ?? "Admin";
    const nameParts = displayName.trim().split(/\s+/);
    const initials = nameParts.slice(0, 2).map((part) => part.charAt(0).toUpperCase()).join("") || "AD";
    const roleLabel = (user?.role ?? "ADMIN").replace(/_/g, " ");

    // Close slideover drawer on Escape
    useEffect(() => {
        if (!menuOpen) return;
        const onKeyDown = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
        document.addEventListener("keydown", onKeyDown);
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", onKeyDown);
            document.body.style.overflow = "";
        };
    }, [menuOpen]);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as Node;
            if (profileRef.current && !profileRef.current.contains(target)) {
                setProfileOpen(false);
            }
            if (notifRef.current && !notifRef.current.contains(target)) {
                setNotifOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Close dropdowns on route changes
    const [prevPath, setPrevPath] = useState(location.pathname);
    if (prevPath !== location.pathname) {
        setPrevPath(location.pathname);
        setProfileOpen(false);
        setNotifOpen(false);
        setMenuOpen(false);
    }

    return (
        <div className="min-h-screen flex flex-row bg-[#F8F9FA] text-[#0F172A] font-sans antialiased selection:bg-[#8B1D24] selection:text-white animate-fade-in">
            {/* MOBILE SLIDE-OVER DRAWER */}
            {menuOpen && (
                <div className="fixed inset-0 z-50 lg:hidden flex" role="dialog" aria-modal="true" aria-label="Menu admin">
                    {/* Backdrop */}
                    <div
                        onClick={() => setMenuOpen(false)}
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-fade-in"
                    />

                    {/* Drawer Sidebar */}
                    <div className="relative w-72 bg-white border-r border-slate-200 flex flex-col justify-between z-10 h-full select-none shadow-2xl animate-fade-up">
                        <div className="flex flex-col flex-1 overflow-y-auto">
                            {/* Top Brand */}
                            <div className="h-18 px-5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-[#1E293B] text-white flex items-center justify-center font-bold text-base shadow-sm shrink-0 overflow-hidden p-1.5">
                                        <img src={logoSekolah} alt="Logo" className="h-full w-full object-contain" />
                                    </div>
                                    <div className="min-w-0">
                                        <div className="font-bold text-base leading-tight tracking-tight text-[#0F172A] truncate">
                                            Panel Admin
                                        </div>
                                        <div className="text-[10px] font-medium text-[#64748B] truncate">
                                            SMK Plus Pelita Nusantara
                                        </div>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setMenuOpen(false)}
                                    aria-label="Tutup menu"
                                    className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                                >
                                    <AdminIcon name="close" className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Nav items */}
                            <div className="p-4 space-y-6 flex-1">
                                <div>
                                    <div className="px-3 mb-2">
                                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                            MANAJEMEN KONTEN
                                        </span>
                                    </div>
                                    <nav className="space-y-1">
                                        {contentNavItems.map((item) => (
                                            <NavLink
                                                key={item.to}
                                                to={item.to}
                                                end={item.end}
                                                onClick={() => setMenuOpen(false)}
                                                className={({ isActive }) =>
                                                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                                                        isActive
                                                            ? "bg-[#1E293B] text-white shadow-sm"
                                                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                                    }`
                                                }
                                            >
                                                <AdminIcon name={item.icon} className="w-4 h-4 shrink-0" />
                                                <span>{item.label}</span>
                                            </NavLink>
                                        ))}
                                    </nav>
                                </div>

                                <div>
                                    <div className="px-3 mb-2">
                                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                            PORTAL & SITUS PUBLIK
                                        </span>
                                    </div>
                                    <nav className="space-y-1">
                                        {portalNavItems.map((item) => (
                                            <a
                                                key={item.href}
                                                href={item.href}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <AdminIcon name={item.icon} className="w-4 h-4 text-slate-500 shrink-0" />
                                                    <span>{item.label}</span>
                                                </div>
                                                <AdminIcon name="external" className="w-3.5 h-3.5 text-slate-400" />
                                            </a>
                                        ))}
                                    </nav>
                                </div>

                                <div>
                                    <div className="px-3 mb-2">
                                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                            PINTAS DASHBOARD
                                        </span>
                                    </div>
                                    <nav className="space-y-1">
                                        {dashboardShortcutItems.map((item) =>
                                            item.isCurrent ? (
                                                <div
                                                    key={item.href}
                                                    className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-[#1E293B] text-white shadow-sm"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <AdminIcon name={item.icon} className="w-4 h-4 shrink-0 text-white" />
                                                        <span>{item.label}</span>
                                                    </div>
                                                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                                                        Aktif
                                                    </span>
                                                </div>
                                            ) : (
                                                <a
                                                    key={item.href}
                                                    href={item.href}
                                                    onClick={() => setMenuOpen(false)}
                                                    className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors group"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <AdminIcon name={item.icon} className="w-4 h-4 text-slate-500 group-hover:text-slate-700 shrink-0" />
                                                        <span>{item.label}</span>
                                                    </div>
                                                    <AdminIcon name="external" className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 shrink-0" />
                                                </a>
                                            )
                                        )}
                                    </nav>
                                </div>

                                <div>
                                    <div className="px-3 mb-2">
                                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                            PENGATURAN
                                        </span>
                                    </div>
                                    <nav className="space-y-1">
                                        {settingNavItems.map((item) => (
                                            <NavLink
                                                key={item.to}
                                                to={item.to}
                                                onClick={() => setMenuOpen(false)}
                                                className={({ isActive }) =>
                                                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                                                        isActive
                                                            ? "bg-[#1E293B] text-white shadow-sm"
                                                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                                    }`
                                                }
                                            >
                                                <AdminIcon name={item.icon} className="w-4 h-4 shrink-0" />
                                                <span>{item.label}</span>
                                            </NavLink>
                                        ))}
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* LEFT SIDEBAR (STICKY ON DESKTOP) */}
            <aside className="hidden lg:flex w-68 shrink-0 h-screen sticky top-0 bg-white border-r border-slate-200/80 flex-col justify-between select-none z-20">
                {/* Brand & Navigation */}
                <div className="flex flex-col flex-1 overflow-y-auto">
                    {/* Brand header */}
                    <div className="h-18 px-5 border-b border-slate-100 flex items-center gap-3 bg-white shrink-0">
                        <div className="w-10 h-10 rounded-2xl bg-[#1E293B] text-white flex items-center justify-center font-bold text-base shadow-sm shrink-0 overflow-hidden p-1.5">
                            <img src={logoSekolah} alt="Logo" className="h-full w-full object-contain" />
                        </div>
                        <div className="min-w-0">
                            <div className="font-bold text-base leading-tight tracking-tight text-[#0F172A] truncate">
                                Panel Admin
                            </div>
                            <div className="text-[10px] font-medium text-[#64748B] truncate">
                                SMK Plus Pelita Nusantara
                            </div>
                        </div>
                    </div>

                    {/* Navigation groups */}
                    <div className="p-4 space-y-6">
                        {/* Section 1: Manajemen Konten */}
                        <div>
                            <div className="px-3 mb-2">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                    MANAJEMEN KONTEN
                                </span>
                            </div>
                            <nav className="space-y-1">
                                {contentNavItems.map((item) => (
                                    <NavLink
                                        key={item.to}
                                        to={item.to}
                                        end={item.end}
                                        className={({ isActive }) =>
                                            `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                                                isActive
                                                    ? "bg-[#1E293B] text-white shadow-sm"
                                                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                            }`
                                        }
                                    >
                                        <AdminIcon name={item.icon} className="w-4 h-4 shrink-0" />
                                        <span>{item.label}</span>
                                    </NavLink>
                                ))}
                            </nav>
                        </div>

                        {/* Section 2: Portal & Informasi */}
                        <div>
                            <div className="px-3 mb-2">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                    PORTAL & SITUS PUBLIK
                                </span>
                            </div>
                            <nav className="space-y-1">
                                {portalNavItems.map((item) => (
                                    <a
                                        key={item.href}
                                        href={item.href}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <AdminIcon name={item.icon} className="w-4 h-4 text-slate-500 shrink-0" />
                                            <span>{item.label}</span>
                                        </div>
                                        <AdminIcon name="external" className="w-3.5 h-3.5 text-slate-400" />
                                    </a>
                                ))}
                            </nav>
                        </div>

                        {/* Section 3: Pintas Dashboard */}
                        <div>
                            <div className="px-3 mb-2">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                    PINTAS DASHBOARD
                                </span>
                            </div>
                            <nav className="space-y-1">
                                {dashboardShortcutItems.map((item) =>
                                    item.isCurrent ? (
                                        <div
                                            key={item.href}
                                            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-[#1E293B] text-white shadow-sm"
                                        >
                                            <div className="flex items-center gap-3">
                                                <AdminIcon name={item.icon} className="w-4 h-4 shrink-0 text-white" />
                                                <span>{item.label}</span>
                                            </div>
                                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                                                Aktif
                                            </span>
                                        </div>
                                    ) : (
                                        <a
                                            key={item.href}
                                            href={item.href}
                                            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <AdminIcon name={item.icon} className="w-4 h-4 text-slate-500 group-hover:text-slate-700 shrink-0" />
                                                <span>{item.label}</span>
                                            </div>
                                            <AdminIcon name="external" className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 shrink-0" />
                                        </a>
                                    )
                                )}
                            </nav>
                        </div>

                        {/* Section 4: Pengaturan */}
                        <div>
                            <div className="px-3 mb-2">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                    PENGATURAN
                                </span>
                            </div>
                            <nav className="space-y-1">
                                {settingNavItems.map((item) => (
                                    <NavLink
                                        key={item.to}
                                        to={item.to}
                                        className={({ isActive }) =>
                                            `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                                                isActive
                                                    ? "bg-[#1E293B] text-white shadow-sm"
                                                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                            }`
                                        }
                                    >
                                        <AdminIcon name={item.icon} className="w-4 h-4 shrink-0" />
                                        <span>{item.label}</span>
                                    </NavLink>
                                ))}
                            </nav>
                        </div>
                    </div>
                </div>
            </aside>

            {/* RIGHT MAIN WRAPPER */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* TOPBAR HEADER */}
                <header className="h-18 bg-white border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
                    <div className="flex items-center gap-3 min-w-0">
                        {/* Mobile hamburger */}
                        <button
                            type="button"
                            onClick={() => setMenuOpen(true)}
                            aria-label="Buka menu"
                            className="p-2 rounded-xl border border-slate-200 lg:hidden text-slate-700 hover:bg-slate-100 cursor-pointer transition-colors"
                        >
                            <AdminIcon name="menu" className="w-5 h-5" />
                        </button>

                        {/* Page Title */}
                        <div>
                            <h1 className="font-bold text-base sm:text-xl tracking-tight text-[#0F172A] truncate leading-tight">
                                {pageTitle}
                            </h1>
                        </div>
                    </div>

                    {/* Topbar Right Controls */}
                    <div className="flex items-center gap-2.5 sm:gap-4">
                        {/* Administrator Status Pill */}
                        <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span>[Administrator Aktif]</span>
                        </div>

                        {/* Notification Button & Dropdown */}
                        <div className="relative" ref={notifRef}>
                            <button
                                type="button"
                                onClick={() => setNotifOpen(!notifOpen)}
                                aria-label="Notifikasi"
                                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors cursor-pointer relative"
                            >
                                <AdminIcon name="bell" className="w-4 h-4" />
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#8B1D24]" />
                            </button>

                            {notifOpen && (
                                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl border border-slate-100 shadow-xl z-50 p-4 text-xs animate-fade-up">
                                    <div className="font-bold border-b border-slate-100 pb-2.5 mb-2.5 flex items-center justify-between text-slate-900">
                                        <span>Notifikasi Sistem</span>
                                        <span className="text-[10px] text-[#8B1D24] bg-red-50 px-2 py-0.5 rounded-full font-bold uppercase">
                                            LIVE
                                        </span>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="p-2.5 rounded-xl bg-red-50/60 border border-red-100">
                                            <p className="font-bold text-[11px] text-[#8B1D24]">Panel Terhubung ke Backend</p>
                                            <p className="text-[11px] text-slate-600 mt-0.5">
                                                API backend Laravel siap melayani manajemen berita, program, dan fasilitas.
                                            </p>
                                        </div>
                                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                                            <p className="font-bold text-[11px] text-slate-800">Situs Publik Aktif</p>
                                            <p className="text-[11px] text-slate-600 mt-0.5">
                                                Perubahan yang disimpan langsung diperbarui di portal publik SMK Pelita Nusantara.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Profile Avatar Widget & Dropdown */}
                        <div className="relative" ref={profileRef}>
                            <button
                                type="button"
                                onClick={() => setProfileOpen(!profileOpen)}
                                className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1.5 rounded-full hover:bg-slate-100 bg-white cursor-pointer transition-colors border border-slate-200/60"
                            >
                                <div className="w-8 h-8 rounded-full bg-[#1E293B] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                                    {initials}
                                </div>
                                <div className="hidden sm:block text-left">
                                    <div className="text-xs font-bold text-[#0F172A] leading-tight max-w-[120px] truncate">
                                        {displayName}
                                    </div>
                                    <div className="text-[10px] text-[#64748B] leading-tight font-medium uppercase">{roleLabel}</div>
                                </div>
                                <AdminIcon name="chevronRight" className="w-3.5 h-3.5 text-slate-400 rotate-90" />
                            </button>

                            {profileOpen && (
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-slate-100 shadow-xl z-50 p-2 text-xs animate-fade-up">
                                    <div className="px-3 py-2.5 border-b border-slate-100 mb-1">
                                        <div className="font-bold text-slate-900 truncate">{displayName}</div>
                                        <div className="text-[10px] text-slate-500 truncate">
                                            {user?.email ?? user?.username ?? "admin"}
                                        </div>
                                        <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-100 text-slate-700 tracking-wider uppercase">
                                            {roleLabel}
                                        </span>
                                    </div>
                                    <Link
                                        to="/admin"
                                        className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-100 text-slate-700 font-medium transition-colors"
                                    >
                                        <AdminIcon name="dashboard" className="w-4 h-4 text-slate-400" />
                                        <span>Dashboard Utama</span>
                                    </Link>
                                    <Link
                                        to="/admin/berita"
                                        className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-100 text-slate-700 font-medium transition-colors"
                                    >
                                        <AdminIcon name="news" className="w-4 h-4 text-slate-400" />
                                        <span>Kelola Berita</span>
                                    </Link>
                                    <Link
                                        to="/admin/akun"
                                        className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-100 text-slate-700 font-medium transition-colors"
                                    >
                                        <AdminIcon name="user" className="w-4 h-4 text-slate-400" />
                                        <span>Pengaturan Akun</span>
                                    </Link>
                                    <div className="border-t border-slate-100 my-1" />
                                    <button
                                        type="button"
                                        onClick={() => void logout()}
                                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-red-700 hover:bg-red-50 font-bold transition-colors cursor-pointer text-left"
                                    >
                                        <AdminIcon name="logout" className="w-4 h-4 text-red-600" />
                                        <span>Keluar Sesi Admin</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* MAIN BODY CONTENT */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    <div className="max-w-7xl mx-auto w-full">
                        <Outlet />
                    </div>
                </main>

                {/* FOOTER STRIP */}
                <footer className="bg-white/80 border-t border-slate-200/80 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
                    <div>
                        <span className="font-bold text-slate-700">Sistem Informasi Landing Page</span> &copy;{" "}
                        {new Date().getFullYear()} SMK Plus Pelita Nusantara Bogor. Hak Cipta Dilindungi.
                    </div>
                    <div className="flex items-center gap-3 text-[11px] font-medium text-slate-400">
                        <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span className="text-slate-600 font-semibold">STATUS: ONLINE</span>
                        </span>
                        <span>•</span>
                        <span>CMS PANEL v1.0.0</span>
                    </div>
                </footer>
            </div>
        </div>
    );
}
