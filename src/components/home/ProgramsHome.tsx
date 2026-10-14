import LoadError from "../LoadError";
import PhotoCard from "../PhotoCard";
import Skeleton from "../Skeleton";
import SketchFrame from "../SketchFrame";
import { usePrograms } from "../../lib/content";

export default function ProgramsHome() {
    const { programs, error, reload } = usePrograms();

    // Belum ada program sama sekali: section tidak ditampilkan
    if (programs?.length === 0) return null;

    return(
        <section className="relative z-10 bg-brand-softmist text-brand-ink px-6 py-20 md:py-28">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-center font-display text-3xl md:text-4xl font-bold uppercase tracking-wide leading-tight">
                    <SketchFrame>Program Unggulan</SketchFrame>
                </h2>
                <p className="mt-6 max-w-2xl mx-auto text-center text-base md:text-lg leading-relaxed text-brand-ink/70">
                    Program sekolah yang membekali siswa dengan pengalaman nyata, dari berwirausaha,
                    belajar bersama praktisi industri, hingga menyiapkan karir setelah lulus.
                </p>

                {error ? (
                    <LoadError message={error.message} onRetry={reload} className="mt-8" />
                ) : !programs ? (
                    <div role="status" aria-label="Memuat program unggulan" className={`mt-12 md:mt-16 ${GRID}`}>
                        {[0, 1, 2].map((i) => (
                            <Skeleton key={i} className={`aspect-4/3 md:aspect-auto md:h-full rounded-card ${bentoCell(i, 3).cell}`} />
                        ))}
                    </div>
                ) : (
                    // HP: satu kolom, tablet kecil: dua kolom (kartu terakhir selebar baris kalau jumlahnya ganjil).
                    // Mulai md kartunya beda ukuran & posisi, lihat bentoCell
                    <ul className={`mt-12 md:mt-16 ${GRID}`}>
                        {programs.map((program, i) => {
                            const lone = programs.length % 2 === 1 && i === programs.length - 1;
                            const { cell, featured } = bentoCell(i, programs.length);
                            return(
                                <li key={program.id} className={`${lone ? "sm:col-span-2" : ""} ${cell}`}>
                                    <PhotoCard
                                        to={`/program/${program.slug}`}
                                        title={program.title}
                                        description={program.description}
                                        image={program.image}
                                        icon={program.icon}
                                        featured={featured}
                                        className={`aspect-4/3 ${lone ? "sm:aspect-5/2" : ""} md:aspect-auto md:h-full`}
                                    />
                                </li>
                            )
                        })}
                    </ul>
                )}
            </div>
        </section>
    )
}

// grid-flow-dense: kelompok yang dicerminkan menaruh kartu kecil di kolom 1 setelah kartu besar di kanan,
// tanpa dense kartu kecil itu terdorong ke baris berikutnya
const GRID = "grid gap-5 sm:grid-cols-2 md:grid-cols-12 md:grid-flow-dense md:auto-rows-[12rem] lg:auto-rows-[15rem]";

// Posisi kartu di grid 12 kolom (md ke atas). Tiap tiga kartu jadi satu kelompok: satu kartu besar setinggi
// dua baris dan dua kartu kecil bertumpuk di sampingnya. Kelompok berikutnya dicerminkan (kartu besar di kanan)
// supaya susunannya tidak monoton. Sisa di akhir: satu kartu dibuat selebar baris, dua kartu dibagi lebar & sempit
function bentoCell(i: number, total: number): { cell: string; featured: boolean } {
    const mirrored = Math.floor(i / 3) % 2 === 1;
    const first = i % 3 === 0;
    const rest = total % 3;

    if (i >= total - rest) {
        if (rest === 1) return { cell: "md:col-span-12", featured: true };
        return first !== mirrored ? { cell: "md:col-span-7", featured: true } : { cell: "md:col-span-5", featured: false };
    }
    if (first) return { cell: `md:col-span-7 md:row-span-2 ${mirrored ? "md:col-start-6" : "md:col-start-1"}`, featured: true };
    return { cell: `md:col-span-5 ${mirrored ? "md:col-start-1" : "md:col-start-8"}`, featured: false };
}
