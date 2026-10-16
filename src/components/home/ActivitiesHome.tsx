import { Link } from "react-router-dom";
import ActivityCarousel from "../ActivityCarousel";
import LoadError from "../LoadError";
import Skeleton from "../Skeleton";
import SketchFrame, { SketchArrow } from "../SketchFrame";
import { useActivities } from "../../lib/content";
import { activityCategoryAnchors, type Activity } from "../../data/activities";

// Kegiatan pilihan siswa dalam satu section: Ekstrakurikuler (olahraga, keagamaan & pramuka) di atas,
// Talent Day (kelas minat) di bawah, masing-masing berupa slide yang bergeser otomatis.
// Latarnya dua pita (putih lalu abu) supaya urutan warna beranda tetap selang-seling:
// Program Unggulan (abu) -> Ekskul (putih) -> Talent Day (abu) -> Fasilitas (putih)
export default function ActivitiesHome() {
    const { activities, error, reload } = useActivities();
    const ekskul = activities?.filter((activity) => activity.category === "ekskul") ?? [];
    const talentDay = activities?.filter((activity) => activity.category === "talent_day") ?? [];

    // Belum ada kegiatan sama sekali: section tidak ditampilkan
    if (activities && ekskul.length === 0 && talentDay.length === 0) return null;

    return(
        <section id="kegiatan" className="relative z-10 bg-white text-brand-ink">
            {error ? (
                <div className="px-6 py-20 md:py-28">
                    <LoadError message={error.message} onRetry={reload} />
                </div>
            ) : !activities ? (
                <div role="status" aria-label="Memuat kegiatan siswa" className="px-6 py-20 md:py-28">
                    <div className="max-w-6xl mx-auto">
                        <Skeleton className="mx-auto h-10 w-64 rounded-lg" />
                        <div className="mt-12 md:mt-16 grid gap-10 md:gap-12 md:grid-cols-[1.1fr_1fr] items-center">
                            <Skeleton className="aspect-4/3 rounded-card" />
                            <div>
                                <Skeleton className="h-10 w-3/4 rounded-lg" />
                                <Skeleton className="mt-8 h-4 w-full max-w-lg rounded-full" />
                                <Skeleton className="mt-3 h-4 w-5/6 max-w-md rounded-full" />
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <ActivityGroup
                        items={ekskul}
                        title="Ekstrakurikuler"
                        listHref={`/kegiatan#${activityCategoryAnchors.ekskul}`}
                        description="Olahraga, keagamaan, dan pramuka: tempat siswa menyalurkan hobi, menjaga kebugaran, memperdalam ilmu agama, dan melatih kepemimpinan."
                        className="bg-white"
                    />
                    {/* Foto di kanan supaya tidak terlihat kembar dengan slide ekskul di atasnya */}
                    <ActivityGroup
                        items={talentDay}
                        title="Talent Day"
                        listHref={`/kegiatan#${activityCategoryAnchors.talent_day}`}
                        description="Di luar pelajaran jurusan, siswa bebas memilih kelas minat sesuai bakatnya, dari memasak hingga membuat game."
                        className="bg-brand-softmist"
                        reverse
                    />
                </>
            )}
        </section>
    )
}

function ActivityGroup({ items, title, listHref, description, className, reverse = false }: {
    items: Activity[];
    title: string;
    listHref: string;
    description: string;
    className: string;
    reverse?: boolean;
}) {
    if (items.length === 0) return null;

    return(
        <div className={`px-6 py-20 md:py-28 ${className}`}>
            <div className="max-w-6xl mx-auto">
                <h2 className="text-center font-display text-3xl md:text-4xl font-bold uppercase tracking-wide leading-tight">
                    <SketchFrame>{title}</SketchFrame>
                </h2>
                <p className="mt-6 max-w-2xl mx-auto text-center text-base md:text-lg leading-relaxed text-brand-ink/70">{description}</p>

                <ActivityCarousel items={items} label={title} reverse={reverse} />

                <div className="mt-10 text-center">
                    <Link to={listHref} className="group inline-flex items-center gap-1.5 text-sm font-semibold text-brand-darkred">
                        Lihat Semua {title}
                        <SketchArrow className="w-6 h-3 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>
            </div>
        </div>
    )
}
