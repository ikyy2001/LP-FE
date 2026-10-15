import logoSekolah from "../../assets/images/logosmkpenus.png";

// Layar peralihan dari situs ke panel admin, tampil selama kode panel diunduh dan sesi diperiksa.
// Latar & logo sama dengan AdminLayout supaya pergantiannya mulus. Isinya baru muncul setelah jeda singkat,
// jadi kalau panel siap dalam sekejap tidak ada kedipan layar pemuatan. message = keterangan langkah yang berjalan.
export default function AdminLoadingScreen({ message = "Memuat panel admin" }: { message?: string }) {
    return(
        <div
            role="status"
            aria-live="polite"
            className="min-h-svh flex items-center justify-center bg-[#F8F9FA] px-6 text-[#0F172A] font-sans antialiased"
        >
            <div className="flex flex-col items-center text-center animate-fade-up [animation-delay:150ms]">
                <div className="relative">
                    <span aria-hidden="true" className="absolute -inset-2 rounded-3xl bg-brand-darkred/15 animate-ping motion-reduce:animate-none" />
                    <div className="relative w-16 h-16 rounded-2xl bg-[#1E293B] p-2.5 shadow-lg shadow-slate-900/20">
                        <img src={logoSekolah} alt="" className="h-full w-full object-contain" />
                    </div>
                </div>

                <p className="mt-7 text-lg font-bold tracking-tight">Menyiapkan Dasbor</p>
                <p className="mt-1 text-sm text-slate-500">{message}&hellip;</p>

                <div aria-hidden="true" className="mt-6 h-1 w-48 overflow-hidden rounded-full bg-slate-200">
                    <div className="h-full w-2/5 rounded-full bg-linear-to-r from-brand-signal to-brand-darkred animate-loading-bar motion-reduce:animate-none" />
                </div>

                <p className="mt-10 text-[11px] font-medium uppercase tracking-wider text-slate-400">
                    Panel Admin &middot; SMK Plus Pelita Nusantara
                </p>
            </div>
        </div>
    )
}
