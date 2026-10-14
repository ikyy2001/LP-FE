import LoadError from "../LoadError";
import PhotoCard from "../PhotoCard";
import Skeleton from "../Skeleton";
import SketchFrame from "../SketchFrame";
import { activityCategoryAnchors, activityImage, type Activity, type ActivityCategory } from "../../data/activities";
import type { ApiError } from "../../lib/api";

// Satu kelompok kegiatan di halaman /kegiatan: judul, penjelasan singkat, lalu semua kegiatannya sebagai kartu
// yang menuju halaman detail. className = warna latar (selang-seling putih & abu)
export default function ActivityListSection({ category, title, eyebrow, description, items, error, onRetry, className }: {
    category: ActivityCategory;
    title: string;
    eyebrow: string;
    description: string;
    items: Activity[] | undefined;
    error: ApiError | undefined;
    onRetry: () => void;
    className: string;
}) {
    return(
        // scroll-mt-6: section tidak menempel ke tepi atas layar saat dituju dari tombol hero / tautan beranda
        <section id={activityCategoryAnchors[category]} className={`relative z-10 scroll-mt-6 text-brand-ink px-6 py-20 md:py-28 ${className}`}>
            <div className="max-w-6xl mx-auto">
                <div className="grid gap-4 md:grid-cols-2 md:items-end">
                    <div>
                        <p className="text-xs uppercase tracking-[0.25em] font-semibold text-brand-darkred">{eyebrow}</p>
                        <h2 className="mt-3 font-display text-3xl md:text-4xl font-bold uppercase tracking-wide leading-tight text-left">
                            {/* -ml-4 md:-ml-5: teks judul tetap sejajar eyebrow di atasnya, garis sikunya yang menjorok ke kiri */}
                            <SketchFrame className="-ml-4 md:-ml-5">{title}</SketchFrame>
                        </h2>
                    </div>
                    <p className="text-base md:text-lg leading-relaxed text-brand-ink/70 md:max-w-md md:justify-self-end">{description}</p>
                </div>

                {error ? (
                    <LoadError message={error.message} onRetry={onRetry} className="mt-8" />
                ) : !items ? (
                    <div role="status" aria-label={`Memuat ${title}`} className="mt-12 md:mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {[0, 1, 2].map((i) => (
                            <Skeleton key={i} className={`aspect-4/3 rounded-card ${i === 2 ? "hidden lg:block" : ""}`} />
                        ))}
                    </div>
                ) : items.length === 0 ? (
                    <p className="mt-12 text-center text-sm text-brand-ink/60">Belum ada {title.toLowerCase()} yang ditampilkan.</p>
                ) : (
                    <ul className="mt-12 md:mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {items.map((activity) => (
                            <li key={activity.id}>
                                <PhotoCard
                                    to={`/kegiatan/${activity.slug}`}
                                    title={activity.title}
                                    description={activity.description}
                                    image={activityImage(activity)}
                                    icon={activity.icon}
                                />
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </section>
    )
}
