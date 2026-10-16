import { useEffect, useRef } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

// Satu instance Lenis yang sedang aktif (null kalau halaman tidak memakai smooth scroll),
// supaya komponen lain bisa ikut scroll lewat Lenis dan tidak saling berebut posisi scroll
let lenis: Lenis | null = null;

export type ScrollFrame = {
    /** Posisi scroll sekarang (px) */
    scroll: number;
    /** Posisi scroll maksimal (px) */
    limit: number;
    /** Kecepatan scroll, positif = ke bawah */
    velocity: number;
};

type ScrollListener = (frame: ScrollFrame) => void;
const listeners = new Set<ScrollListener>();

function currentFrame(): ScrollFrame {
    if (lenis) return { scroll: lenis.scroll, limit: lenis.limit, velocity: lenis.velocity };
    return { scroll: window.scrollY, limit: document.documentElement.scrollHeight - window.innerHeight, velocity: 0 };
}

function emit() {
    const frame = currentFrame();
    listeners.forEach((listener) => listener(frame));
}

// Pasang smooth scroll Lenis selama halaman yang memanggil hook ini terbuka.
// Pengguna "prefers-reduced-motion" tetap memakai scroll bawaan browser (Lenis menghormatinya sendiri).
export function useSmoothScroll() {
    useEffect(() => {
        const instance = new Lenis({
            autoRaf: true,
            // Bawaan 0.1 terasa "ngambang". 0.12 tetap halus tapi halaman lebih cepat menyusul roda mouse
            lerp: 0.12,
        });
        lenis = instance;

        // Dipanggil di frame yang sama dengan perubahan posisi scroll (sebelum digambar browser),
        // jadi efek yang mengikuti scroll tidak telat satu frame
        instance.on("scroll", emit);
        window.addEventListener("resize", emit);
        emit();

        return () => {
            window.removeEventListener("resize", emit);
            instance.destroy();
            if (lenis === instance) lenis = null;
        };
    }, []);
}

// Daftarkan listener posisi scroll, langsung dipanggil sekali. Hasilnya = fungsi untuk berhenti mendengarkan.
function subscribe(listener: ScrollListener) {
    listeners.add(listener);
    listener(currentFrame());

    // Tanpa Lenis (mis. dipakai di halaman lain), tetap ikut scroll bawaan browser
    const onScroll = () => !lenis && listener(currentFrame());
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
        listeners.delete(listener);
        window.removeEventListener("scroll", onScroll);
    };
}

// Jalankan callback setiap kali posisi scroll berubah (juga sekali saat dipasang & saat layar diubah ukurannya).
// Ubah style elemen langsung lewat ref di dalam callback, jangan setState, supaya tidak render ulang tiap frame.
export function useScrollFrame(callback: ScrollListener) {
    const ref = useRef(callback);

    useEffect(() => {
        ref.current = callback;
    });

    useEffect(() => subscribe((frame) => ref.current(frame)), []);
}

// Panggil semua callback useScrollFrame sekarang juga, mis. setelah elemen yang digerakkan selesai dirender
export function refreshScrollFrame() {
    emit();
}

type ScrollOptions = {
    duration?: number;
    easing?: (t: number) => number;
    onComplete?: () => void;
};

// Scroll ke posisi tertentu: lewat Lenis kalau aktif, kalau tidak pakai scroll bawaan browser
export function smoothScrollTo(top: number, { duration, easing, onComplete }: ScrollOptions = {}) {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (lenis) {
        lenis.scrollTo(top, { duration, easing, immediate: reduce, onComplete: () => onComplete?.() });
        return;
    }

    window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
    onComplete?.();
}

// Hentikan animasi scroll yang sedang berjalan (mis. saat pengguna mulai scroll sendiri)
export function stopSmoothScroll() {
    if (!lenis) return;
    lenis.stop();
    lenis.start();
}

// Efek parallax untuk semua elemen ber-atribut data-speed di halaman (mis. data-speed="0.08"):
// elemen bergeser pelan berlawanan arah scroll, makin jauh dari tengah layar makin besar geserannya.
// Positif = bergerak lebih lambat dari halaman, negatif = lebih cepat. Hanya untuk mouse/trackpad di layar lebar,
// karena di HP scroll sentuh tidak lewat Lenis sehingga geserannya bisa telat satu frame dan terlihat bergetar.
export function useParallax() {
    useEffect(() => {
        const media = window.matchMedia("(min-width: 64rem) and (any-pointer: fine) and (prefers-reduced-motion: no-preference)");
        let items: { el: HTMLElement; speed: number; top: number; height: number }[] = [];

        const reset = () =>
            items.forEach(({ el }) => {
                el.style.transform = "";
                el.style.willChange = "";
            });

        const update = ({ scroll }: ScrollFrame) => {
            const vh = window.innerHeight;
            for (const { el, speed, top, height } of items) {
                // Lewati elemen yang jauh di luar layar
                if (top + height < scroll - vh || top > scroll + vh * 2) continue;
                const offset = (top + height / 2 - (scroll + vh / 2)) * speed;
                el.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`;
            }
        };

        // Posisi asli tiap elemen (tanpa geseran parallax) diukur ulang setiap kali tinggi halaman berubah,
        // mis. setelah gambar atau data dari API selesai dimuat
        const measure = () => {
            reset();
            items = !media.matches ? [] : Array.from(document.querySelectorAll<HTMLElement>("[data-speed]")).map((el) => {
                const rect = el.getBoundingClientRect();
                el.style.willChange = "transform";
                return { el, speed: Number(el.dataset.speed) || 0, top: rect.top + window.scrollY, height: rect.height };
            });
            update(currentFrame());
        };

        const resizeObserver = new ResizeObserver(measure);
        resizeObserver.observe(document.body);
        media.addEventListener("change", measure);
        const unsubscribe = subscribe(update);

        return () => {
            unsubscribe();
            resizeObserver.disconnect();
            media.removeEventListener("change", measure);
            reset();
        };
    }, []);
}
