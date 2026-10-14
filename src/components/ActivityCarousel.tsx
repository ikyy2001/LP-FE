import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide, type SwiperClass } from "swiper/react";
import { A11y, Autoplay, Keyboard } from "swiper/modules";
import "swiper/css";
import Icon from "./Icon";
import SketchFrame, { SketchArrow, SketchUnderline } from "./SketchFrame";
import { activityImage, type Activity } from "../data/activities";

// Jeda sebelum bergeser otomatis ke kegiatan berikutnya
const AUTOPLAY_DELAY = 5000;

// Slide satu kegiatan per tampilan (model carousel Program Unggulan yang lama): foto di satu sisi, nama, deskripsi
// & tautan detail di sisi lain. Berganti dengan bergeser ke samping, seperti slider fasilitas di beranda.
// Bergeser sendiri setiap AUTOPLAY_DELAY, berhenti sementara saat kursor di atasnya dan saat tidak terlihat
// di layar. Mati untuk pengguna "kurangi animasi". reverse = foto di kanan pada desktop.
// label = nama carousel untuk pembaca layar & tombol geser
export default function ActivityCarousel({ items, label, reverse = false }: { items: Activity[]; label: string; reverse?: boolean }) {
    const [swiper, setSwiper] = useState<SwiperClass | null>(null);
    const [active, setActive] = useState(0);
    const [reduceMotion] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const ref = useRef<HTMLDivElement>(null);
    // Isi titik penanda aktif, diubah langsung tiap frame oleh event autoplay (tanpa render ulang)
    const timerRef = useRef<HTMLSpanElement | null>(null);

    const count = items.length;
    const autoplay = !reduceMotion && count > 1;

    // Mulai menghitung hanya selama carousel terlihat, supaya slide Talent Day tidak berganti sebelum sampai di sana
    useEffect(() => {
        const el = ref.current;
        if (!el || !swiper || !autoplay) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (swiper.destroyed) return;
                if (entry?.isIntersecting) swiper.autoplay.start();
                else swiper.autoplay.stop();
            },
            { threshold: 0.4 },
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [swiper, autoplay]);

    return(
        <div ref={ref} className="mt-12 md:mt-16">
            <Swiper
                modules={[A11y, Autoplay, Keyboard]}
                // Loop butuh minimal 3 slide; kurang dari itu, slide terakhir kembali ke awal
                loop={count >= 3}
                rewind={count < 3}
                slidesPerView={1}
                spaceBetween={48}
                keyboard={{ enabled: true, onlyInViewport: true }}
                autoplay={autoplay ? { delay: AUTOPLAY_DELAY, disableOnInteraction: false, pauseOnMouseEnter: true } : false}
                a11y={{ containerRoleDescriptionMessage: "carousel", prevSlideMessage: `${label} sebelumnya`, nextSlideMessage: `${label} berikutnya` }}
                onSwiper={setSwiper}
                onRealIndexChange={(s) => setActive(s.realIndex)}
                onAutoplayTimeLeft={(_s, _time, progress) => {
                    if (timerRef.current) timerRef.current.style.transform = `scaleX(${(1 - progress).toFixed(3)})`;
                }}
                // "!" menimpa padding bawaan swiper.css: ruang untuk bayangan foto supaya tidak terpotong
                className="-mx-4! px-4! pt-2! pb-8!"
            >
                {items.map((activity) => (
                    <SwiperSlide key={activity.id} className="h-auto!">
                        <ActivitySlide activity={activity} reverse={reverse} />
                    </SwiperSlide>
                ))}
            </Swiper>

            {count > 1 && (
                <div className="mt-4 flex items-center justify-between gap-4">
                    <SlideButton direction="left" onClick={() => swiper?.slidePrev()} label={`${label} sebelumnya`} />

                    <div className="flex flex-wrap justify-center gap-2.5">
                        {items.map((activity, i) => (
                            <button
                                key={activity.id}
                                type="button"
                                onClick={() => (count >= 3 ? swiper?.slideToLoop(i) : swiper?.slideTo(i))}
                                aria-label={`Tampilkan ${activity.title}`}
                                aria-current={i === active ? "true" : undefined}
                                className={`relative h-2.5 overflow-hidden rounded-full transition-all duration-300 ${
                                    i === active
                                        ? `w-8 ${autoplay ? "bg-brand-ink/15" : "bg-brand-darkred"}`
                                        : "w-2.5 bg-brand-ink/20 hover:bg-brand-ink/40"
                                }`}
                            >
                                {/* Titik aktif terisi pelan-pelan: tanda kapan slide berikutnya muncul */}
                                {i === active && autoplay && (
                                    <span ref={timerRef} className="absolute inset-0 origin-left scale-x-0 bg-brand-darkred" />
                                )}
                            </button>
                        ))}
                    </div>

                    <SlideButton direction="right" onClick={() => swiper?.slideNext()} label={`${label} berikutnya`} />
                </div>
            )}
        </div>
    )
}

function ActivitySlide({ activity, reverse }: { activity: Activity; reverse: boolean }) {
    return(
        <div className="grid gap-10 md:gap-12 md:grid-cols-[1.1fr_1fr] items-center">
            <div className={`relative aspect-4/3 overflow-hidden rounded-card bg-linear-to-b from-white to-brand-mist shadow-xl ${reverse ? "md:order-last" : ""}`}>
                <img src={activityImage(activity)} alt={activity.title} className="w-full h-full object-cover" loading="lazy" />
            </div>

            <div className="text-left">
                <h3 className="mt-6 font-display text-3xl md:text-4xl font-bold uppercase tracking-wide leading-tight">
                    {/* Coretan digambar saat slidenya masuk ke layar */}
                    <SketchUnderline size="lg" tone="text-brand-signal" delay={300}>{activity.title}</SketchUnderline>
                </h3>

                <p className="mt-8 max-w-lg text-base leading-relaxed text-brand-ink/70">{activity.description}</p>

                {activity.schedule && (
                    <p className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-darkred">
                        <Icon name="clock" className="w-4 h-4" />
                        {activity.schedule}
                    </p>
                )}

                <div>
                    <Link
                        to={`/kegiatan/${activity.slug}`}
                        className="group mt-6 inline-flex items-center gap-3 rounded-full py-3.5 text-sm font-semibold text-brand-darkred transition-transform hover:-translate-y-0.5"
                    >
                        <SketchFrame>
                            {/* SketchArrow berupa block, jadi teks & panah dijejerkan dengan inline-flex supaya tidak turun baris */}
                            <span className="inline-flex items-center gap-3">
                                Lihat Detail
                                <SketchArrow className="w-8 h-4 transition-transform group-hover:translate-x-1" />
                            </span>
                        </SketchFrame>
                    </Link>
                </div>
            </div>
        </div>
    )
}

// Sama seperti tombol geser slider fasilitas beranda
function SlideButton({ direction, onClick, label }: { direction: "left" | "right"; onClick: () => void; label: string }) {
    return(
        <button
            type="button"
            onClick={onClick}
            aria-label={label}
            className="shrink-0 w-12 h-12 rounded-lg bg-brand-darkred text-white flex items-center justify-center shadow-lg shadow-brand-darkred/25 transition-colors hover:bg-brand-deepred"
        >
            <SketchArrow className={`w-7 h-3.5 ${direction === "left" ? "-scale-x-100" : ""}`} />
        </button>
    )
}
