import { Link } from "react-router-dom";
import Icon, { type IconName } from "./Icon";
import { SketchArrow } from "./SketchFrame";

// Kartu bergambar penuh yang menuju halaman detail, sama seperti kartu berita. Dipakai untuk Program Unggulan
// (beranda & "Program Lainnya") dan kegiatan siswa (/kegiatan & "Kegiatan Lainnya").
// icon = ditampilkan selama belum ada foto. className = rasio kartu (bawaan 4:3).
// featured = kartu besar, judul & ringkasannya ikut membesar mulai layar tablet
export default function PhotoCard({ to, title, description, image, icon, className = "aspect-4/3", featured = false }: {
    to: string;
    title: string;
    description: string;
    image: string | null;
    icon: IconName;
    className?: string;
    featured?: boolean;
}) {
    return(
        <Link
            to={to}
            className={`group relative block overflow-hidden rounded-card bg-linear-to-br from-brand-signal to-brand-deepred shadow-lg shadow-brand-ink/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-darkred ${className}`}
        >
            {image ? (
                <img
                    src={image}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                />
            ) : (
                <div className="absolute inset-0 flex items-center justify-center text-white/15 transition-transform duration-500 group-hover:scale-110">
                    <Icon name={icon} className="w-16 h-16" />
                </div>
            )}

            <div className="absolute inset-0 bg-linear-to-t from-brand-ink/90 via-brand-ink/40 to-transparent" />

            {/* text-left: kartu sempit, teks yang terbungkus jadi renggang kalau ikut justify dari body */}
            <div className="absolute inset-x-0 bottom-0 pl-5 pr-14 py-5 md:pl-6 md:py-6 text-left">
                <h3 className={`text-lg font-semibold text-white ${featured ? "md:text-2xl" : ""}`}>{title}</h3>
                <p className={`mt-1 text-sm leading-relaxed text-white/75 line-clamp-2 ${featured ? "md:mt-2 md:max-w-xl md:text-base" : ""}`}>{description}</p>
            </div>

            {/* Dibungkus span karena SketchArrow sendiri sudah "relative" */}
            <span className="absolute bottom-6 right-5 md:bottom-7 text-white transition-transform group-hover:translate-x-1">
                <SketchArrow className="w-7 h-3.5" />
            </span>
        </Link>
    )
}
