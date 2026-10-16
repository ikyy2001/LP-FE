import { Link } from "react-router-dom";
import ArticleBlock from "./ArticleBlock";
import Icon, { type IconName } from "./Icon";
import { SketchCorner, SketchSparks, SketchUnderline } from "./SketchFrame";
import type { NewsBlock } from "../data/news";

const chevron = (
    <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="m9 6 6 6-6 6" />
    </svg>
);

export type Crumb = { label: string; to?: string };

// Halaman detail program & kegiatan siswa: foto di kiri (menempel saat discroll), judul, info singkat & isi di kanan.
// crumbs = breadcrumb di antara "Beranda" dan judul. meta = baris info di bawah judul (mis. peserta & jadwal).
// icon = ditampilkan selama belum ada foto
export default function DetailArticle({ crumbs, eyebrow, title, description, image, icon, meta, body }: {
    crumbs: Crumb[];
    eyebrow: string;
    title: string;
    description: string;
    image: string | null;
    icon: IconName;
    meta: { icon: IconName; label: string }[];
    body: NewsBlock[];
}) {
    // Coretan hanya di kata terakhir judul: kalau seluruh judul, garisnya ikut melebar saat judul terlipat dua baris
    const words = title.split(" ");
    const lastWord = words.pop();
    const firstWords = words.join(" ");

    return(
        // Tanpa hero gelap, jadi pt besar supaya isi tidak tertutup navbar.
        // Jangan beri overflow-hidden: foto di kolom kiri memakai sticky, dan sticky tidak berfungsi di dalam overflow-hidden.
        <section className="relative bg-white text-brand-ink px-6 pt-32 pb-20 md:pt-40 md:pb-28">
            {/* Dekorasi titik-titik */}
            <div aria-hidden="true" className="pointer-events-none absolute right-6 top-28 hidden md:block w-40 h-28 bg-[radial-gradient(circle,var(--color-brand-mist)_2px,transparent_2.5px)] bg-size-[22px_22px]" />

            <div className="relative max-w-6xl mx-auto">
                <nav aria-label="Breadcrumb">
                    {/* Tanpa flex-wrap: judul yang menyusut & terpotong, supaya breadcrumb tetap satu baris di HP */}
                    <ol className="flex items-center gap-2 text-sm text-brand-ink/50">
                        <li className="shrink-0">
                            <Link to="/" className="transition-colors hover:text-brand-darkred">Beranda</Link>
                        </li>
                        {crumbs.map((crumb) => (
                            <li key={crumb.label} className="flex shrink-0 items-center gap-2">
                                {chevron}
                                {crumb.to ? (
                                    <Link to={crumb.to} className="transition-colors hover:text-brand-darkred">{crumb.label}</Link>
                                ) : crumb.label}
                            </li>
                        ))}
                        <li className="flex min-w-0 items-center gap-2">
                            {chevron}
                            <span aria-current="page" className="truncate font-medium text-brand-ink">{title}</span>
                        </li>
                    </ol>
                </nav>

                {/* HP & tablet: judul, foto, lalu isi seperti blog biasa.
                    Desktop: foto di kolom kiri (ikut menempel saat discroll), judul & isi di kolom kanan */}
                <article className="mt-10 md:mt-12 grid gap-y-12 lg:gap-y-10 lg:gap-x-16 xl:gap-x-20 lg:grid-cols-[5fr_6fr]">
                    <header className="lg:col-start-2 animate-fade-up">
                        <p className="text-xs sm:text-sm md:text-base uppercase tracking-[0.25em] font-semibold text-brand-darkred">
                            <SketchSparks>{eyebrow}</SketchSparks>
                        </p>
                        {/* text-left: judul yang terlipat jadi renggang antar katanya kalau ikut justify dari body.
                            delay: coretan mulai setelah teks selesai muncul */}
                        <h1 className="mt-4 text-left font-display text-3xl md:text-4xl lg:text-5xl font-bold uppercase tracking-wide leading-tight">
                            {firstWords && `${firstWords} `}
                            <SketchUnderline size="lg" tone="text-brand-signal" delay={500}>{lastWord}</SketchUnderline>
                        </h1>

                        {/* mt-10: memberi ruang untuk garis coretan yang menggantung di bawah judul */}
                        <ul className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-brand-ink/70">
                            {meta.map((m) => (
                                <li key={m.label} className="flex items-center gap-2">
                                    <Icon name={m.icon} className="w-4 h-4 shrink-0 text-brand-darkred" />
                                    {m.label}
                                </li>
                            ))}
                        </ul>
                    </header>

                    {/* row-span-2 + sticky: foto menempel di kiri selama judul & isi di kanan discroll.
                        top-32 = di bawah navbar mengambang */}
                    <div className="relative lg:col-start-1 lg:row-start-1 lg:row-span-2 lg:self-start lg:sticky lg:top-32 animate-fade-up [animation-delay:150ms]">
                        {image ? (
                            <img
                                src={image}
                                alt=""
                                className="w-full aspect-4/3 object-cover rounded-card bg-brand-softmist shadow-2xl"
                            />
                        ) : (
                            <div className="w-full aspect-4/3 rounded-card bg-linear-to-br from-brand-signal to-brand-deepred shadow-2xl flex items-center justify-center text-white/15">
                                <Icon name={icon} className="w-28 h-28 md:w-36 md:h-36" />
                            </div>
                        )}

                        {/* Garis siku coretan di pojok kanan atas & kiri bawah foto, sama seperti bingkai video di beranda */}
                        <SketchCorner className="-top-5 -right-5 w-16 h-16 md:-top-8 md:-right-8 md:w-28 md:h-28 rotate-90" />
                        <SketchCorner delay={350} className="-bottom-5 -left-5 w-16 h-16 md:-bottom-8 md:-left-8 md:w-28 md:h-28 -rotate-90" />
                    </div>

                    {/* pt di HP: paragraf pembuka tidak menempel ke siku kiri bawah foto */}
                    <div className="min-w-0 pt-2 md:pt-4 lg:pt-0 lg:col-start-2">
                        <p className="text-base md:text-lg leading-relaxed font-medium">{description}</p>

                        {body.length > 0 && (
                            <div className="mt-6 space-y-6">
                                {body.map((block, i) => (
                                    <ArticleBlock key={i} block={block} />
                                ))}
                            </div>
                        )}
                    </div>
                </article>
            </div>
        </section>
    )
}
