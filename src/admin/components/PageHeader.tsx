import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import AdminIcon from "./AdminIcon";

// Judul halaman admin. back = tautan kembali (mis. ke daftar), actions = tombol di kanan
export default function PageHeader({ title, description, back, actions }: {
    title: string;
    description?: ReactNode;
    back?: { to: string; label: string };
    actions?: ReactNode;
}) {
    return(
        <header className="mb-6 md:mb-8">
            {back && (
                <Link to={back.to} className="mb-2.5 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition-colors hover:text-[#8B1D24]">
                    <AdminIcon name="chevronLeft" className="w-4 h-4" />
                    {back.label}
                </Link>
            )}
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div className="min-w-0">
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-[#0F172A] leading-tight">{title}</h1>
                    {description && <p className="mt-1.5 max-w-2xl text-xs sm:text-sm leading-relaxed text-slate-500">{description}</p>}
                </div>
                {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
            </div>
        </header>
    )
}
