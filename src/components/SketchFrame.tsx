import { useEffect, useRef, useState, type ReactNode } from "react";
import { refreshScrollFrame, useScrollFrame } from "../lib/smoothScroll";

// Kumpulan hiasan "coretan tangan". Semua goresan "digambar" sekali saat pertama kali terlihat di layar
// (langsung tampil kalau pengguna memilih kurangi animasi).

// Bingkai garis siku di kiri atas & kanan bawah judul, senada dengan bingkai video di Intro.
// Isi dengan teks judul di dalam <h2>. Untuk judul rata kiri, beri className margin negatif
// (mis. "-ml-4 md:-ml-5") supaya teksnya tetap sejajar dengan konten dan garisnya menjorok ke kiri.
export default function SketchFrame({ children, className = "" }: { children: ReactNode; className?: string }) {
    return(
        <span className={`relative inline-block px-4 py-2 md:px-5 md:py-2.5 ${className}`}>
            <SketchCorner className="left-0 top-0 w-24 h-10 md:w-32 md:h-12" />
            {children}
            <SketchCorner delay={350} className="right-0 bottom-0 rotate-180 w-24 h-10 md:w-32 md:h-12" />
        </span>
    )
}

// Satu siku (garis atas + garis kiri). className wajib berisi posisi & ukuran. Arah lain didapat dengan memutar:
// rotate-90 = kanan atas, rotate-180 = kanan bawah, -rotate-90 = kiri bawah.
export function SketchCorner({ className, delay = 0 }: { className: string; delay?: number }) {
    return <SketchSvg strokes={cornerStrokes} viewBox={[140, 56]} className={`text-brand-darkred ${className}`} delay={delay} />;
}

// Lingkaran coretan yang melingkari satu kata, ujungnya sengaja kebablasan seperti dilingkari spidol
export function SketchCircle({ children }: { children: ReactNode }) {
    return(
        <span className="relative inline-block px-1">
            {children}
            <SketchSvg strokes={circleStrokes} viewBox={[200, 64]} duration={900} className="text-brand-darkred -left-3 -right-3 -top-2 -bottom-2 md:-left-4 md:-right-4 md:-top-2.5 md:-bottom-2.5" />
        </span>
    )
}

// Versi besar SketchCircle untuk dipasang di belakang foto (mis. foto siswa di banner footer), goresannya lebih tebal.
// className wajib berisi posisi, ukuran & warna. Taruh sebelum fotonya dan beri foto "relative" supaya foto di atas.
export function SketchLoop({ className, delay = 0 }: { className: string; delay?: number }) {
    return <SketchSvg strokes={circleStrokes.map((s) => ({ ...s, width: s.width * 1.5 }))} viewBox={[200, 64]} duration={1200} delay={delay} className={className} />;
}

// Garis bawah coretan: beberapa goresan tipis bolak-balik seperti dicoret spidol berkali-kali.
// sm = menu/kategori aktif, md = judul section, lg = judul hero. tone = warna goresan.
const underlineSizes = {
    sm: { className: "-left-1 -right-1 -bottom-2 h-2", scale: 0.55 },
    md: { className: "-left-3 -right-5 -bottom-3 h-3.5 md:-bottom-4 md:h-4", scale: 1 },
    lg: { className: "-left-3 -right-8 -bottom-4 h-4 sm:-bottom-5 sm:h-5 md:-bottom-6 md:h-6 lg:h-7", scale: 1.5 },
};

export function SketchUnderline({ children, size = "md", tone = "text-brand-darkred", delay = 0 }: {
    children: ReactNode;
    size?: keyof typeof underlineSizes;
    tone?: string;
    delay?: number;
}) {
    const { className, scale } = underlineSizes[size];

    return(
        <span className="relative inline-block">
            {children}
            <SketchSvg
                strokes={underlineStrokes.map((s) => ({ ...s, width: s.width * scale }))}
                viewBox={[300, 20]}
                duration={450}
                stagger={130}
                delay={delay}
                className={`${tone} ${className}`}
            />
        </span>
    )
}

// Tiga garis "kilau" kecil di pojok kanan atas kata, muncul satu per satu. tone = warna goresan.
export function SketchSparks({ children, tone = "text-brand-darkred" }: { children: ReactNode; tone?: string }) {
    return(
        <span className="relative inline-block">
            {children}
            <SketchSvg strokes={sparkStrokes} viewBox={[40, 40]} duration={300} stagger={150} className={`${tone} -right-6 -top-3 w-7 h-7 md:-right-8 md:-top-4 md:w-9 md:h-9`} />
        </span>
    )
}

// Panah coretan menghadap kanan (balik dengan "-scale-x-100" untuk panah kiri) atau ke bawah (direction="down").
// className = ukuran, perbandingan 2:1 (kanan, mis. w-7 h-3.5) atau 1:2 (bawah, mis. w-3 h-6).
// Warna mengikuti currentColor induknya, jadi efek hover warna di tombol tetap berlaku.
export function SketchArrow({ className, delay = 0, direction = "right" }: {
    className: string;
    delay?: number;
    direction?: "right" | "down";
}) {
    const down = direction === "down";

    return(
        <span className={`relative block ${className}`}>
            <SketchSvg
                strokes={down ? arrowDownStrokes : arrowStrokes}
                viewBox={down ? [24, 48] : [48, 24]}
                duration={350}
                stagger={150}
                delay={delay}
                className="inset-0"
            />
        </span>
    )
}

// Garis panjang coretan, mis. pemisah di bawah section. className wajib berisi posisi, lebar & tinggi.
// Digambar dari kiri ke kanan; balik dengan "-scale-x-100" supaya digambar dari kanan.
export function SketchLine({ className, delay = 0 }: { className: string; delay?: number }) {
    return <SketchSvg strokes={lineStrokes} viewBox={[300, 12]} duration={900} delay={delay} className={`text-brand-darkred ${className}`} />;
}

// Garis tabel coretan. bold = bingkai luar (goresan tebal + tipis seperti SketchLine), selain itu garis tipis
// pemisah baris/kolom. vertical = garis tegak, digambar dari atas ke bawah. className wajib berisi posisi, ukuran
// & warna: mendatar setinggi h-3, tegak selebar w-3. Arah lain didapat dengan membalik (-scale-x-100 / -scale-y-100).
// scale = pengali tebal goresan, mis. 1.6 untuk garis pemisah yang sedikit lebih tegas.
export function SketchRule({ className, delay = 0, vertical = false, bold = false, scale = 1 }: {
    className: string;
    delay?: number;
    vertical?: boolean;
    bold?: boolean;
    scale?: number;
}) {
    const strokes = vertical ? (bold ? lineDownStrokes : ruleDownStrokes) : (bold ? lineStrokes : ruleStrokes);

    return(
        <SketchSvg
            strokes={strokes.map((s) => ({ ...s, width: s.width * scale }))}
            viewBox={vertical ? [12, 300] : [300, 12]}
            duration={900}
            delay={delay}
            // Garis tegak bisa lebih tinggi dari layar HP, jadi cukup sebagian kecil terlihat untuk mulai menggambar
            threshold={vertical ? 0.1 : 0.6}
            className={className}
        />
    )
}

// Bingkai kotak coretan penuh dari empat SketchRule tebal, digambar memutar seperti tangan: atas, kanan, bawah,
// lalu kiri. Ujung tiap garis sengaja kebablasan melewati sudut (±8px), jadi beri jarak antar kotak minimal gap-6.
// Taruh di dalam elemen "relative" yang mau dibingkai. tone = warna goresan (mis. putih transparan di latar gelap).
export function SketchBox({ delay = 0, tone = "text-brand-darkred" }: { delay?: number; tone?: string }) {
    return(
        <>
            <SketchRule bold delay={delay} className={`${tone} -left-2 -right-2 -top-1 h-3`} />
            <SketchRule bold vertical delay={delay + 250} className={`${tone} -top-2 -bottom-2 -right-1 w-3 -scale-x-100`} />
            <SketchRule bold delay={delay + 500} className={`${tone} -left-2 -right-2 -bottom-1 h-3 rotate-180`} />
            <SketchRule bold vertical delay={delay + 750} className={`${tone} -top-2 -bottom-2 -left-1 w-3 -scale-y-100`} />
        </>
    )
}

// Penanda posisi scroll: garis tegak coretan di tepi kanan layar yang "digambar" mengikuti scroll halaman,
// lengkap dengan ujung pena. Garis tipis samar di belakangnya = jalur yang belum tergambar.
// Muncul setelah hero lewat (desktop saja). Pasang sekali per halaman, posisinya fixed.
export function SketchProgress() {
    const ref = useRef<HTMLDivElement>(null);
    const pathRefs = useRef<(SVGPathElement | null)[]>([]);
    const nibRef = useRef<SVGCircleElement>(null);
    const [size, setSize] = useState<{ w: number; h: number } | null>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const resizeObserver = new ResizeObserver(() => setSize({ w: el.offsetWidth, h: el.offsetHeight }));
        resizeObserver.observe(el);
        return () => resizeObserver.disconnect();
    }, []);

    // Goresan baru ada setelah ukurannya diketahui, jadi gambar ulang tanpa menunggu scroll berikutnya
    useEffect(() => {
        if (size) refreshScrollFrame();
    }, [size]);

    useScrollFrame(({ scroll, limit }) => {
        const el = ref.current;
        if (!el) return;

        const vh = window.innerHeight;
        // Mulai terlihat saat hero setengah tertutup, penuh saat hero tertutup
        el.style.opacity = Math.min(Math.max((scroll - vh * 0.5) / (vh * 0.5), 0), 1).toFixed(3);
        const progress = limit > 0 ? Math.min(Math.max(scroll / limit, 0), 1) : 0;

        pathRefs.current.forEach((path, i) => {
            if (!path) return;
            const length = path.getTotalLength();
            // Goresan tipis sedikit tertinggal di belakang goresan tebal, seperti ditimpa dua kali
            const p = Math.max(progress - i * 0.025, 0);
            path.style.strokeDasharray = `${length}`;
            path.style.strokeDashoffset = `${(length * (1 - p)).toFixed(2)}`;

            if (i === 0 && nibRef.current) {
                const point = path.getPointAtLength(length * p);
                nibRef.current.setAttribute("cx", point.x.toFixed(2));
                nibRef.current.setAttribute("cy", point.y.toFixed(2));
            }
        });
    });

    const [vbW, vbH] = [12, 300];
    const scale = (d: string) => (size ? scalePath(d, size.w / vbW, size.h / vbH) : "");

    return(
        <div
            ref={ref}
            aria-hidden="true"
            className="pointer-events-none fixed right-3 xl:right-5 top-1/2 -translate-y-1/2 z-40 hidden lg:block w-3 h-[46vh] opacity-0"
        >
            {size && size.h > 0 && (
                <svg
                    className="block overflow-visible"
                    width={size.w}
                    height={size.h}
                    viewBox={`0 0 ${size.w} ${size.h}`}
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    {ruleDownStrokes.map((stroke) => (
                        <path key={stroke.d} d={scale(stroke.d)} strokeWidth={stroke.width} className="text-brand-ink/15" />
                    ))}
                    {lineDownStrokes.map((stroke, i) => (
                        <path
                            key={stroke.d}
                            ref={(node) => {
                                pathRefs.current[i] = node;
                            }}
                            d={scale(stroke.d)}
                            strokeWidth={stroke.width}
                            className="text-brand-darkred"
                        />
                    ))}
                    <circle ref={nibRef} r={3.5} className="fill-brand-darkred stroke-none" />
                </svg>
            )}
        </div>
    )
}

type Stroke = { d: string; width: number; order: number };

// Koordinat goresan ditulis dalam kotak viewBox, lalu diskalakan ke ukuran asli di layar (lihat SketchSvg).
// Hanya pakai perintah absolut M / C / S supaya angka-angkanya selalu berpasangan x y.

// Tiap sisi dua goresan: tebal lalu tipis sedikit bergeser
const cornerStrokes: Stroke[] = [
    { d: "M3 5C35 3 80 6 136 2", width: 3, order: 0 },
    { d: "M4 3C3 20 6 36 4 54", width: 3, order: 0 },
    { d: "M9 9C45 7 88 10 122 7", width: 1.5, order: 1 },
    { d: "M8 8C7 22 9 36 7 47", width: 1.5, order: 1 },
];

// Satu putaran penuh lalu kebablasan melewati titik awal, ditambah goresan tipis di sisi kanan
const circleStrokes: Stroke[] = [
    { d: "M170 10C130 0 55 1 22 14C2 22 3 44 34 54C80 66 160 62 188 46C204 36 196 14 150 7C128 4 104 5 86 8", width: 2.75, order: 0 },
    { d: "M182 20C190 30 178 44 150 52", width: 1.5, order: 1 },
];

// Arah goresan bolak-balik (kanan, kiri, kanan, kiri) seperti tangan yang mencoret berulang kali
const underlineStrokes: Stroke[] = [
    { d: "M6 10C70 6 150 9 220 6S285 5 296 4", width: 3.5, order: 0 },
    { d: "M298 8C280 9 220 10 150 11S40 13 2 13", width: 2, order: 1 },
    { d: "M20 16C90 13 170 15 262 11", width: 1.5, order: 2 },
    { d: "M120 7C80 8 44 7 10 8", width: 1.25, order: 3 },
];

// Memancar dari pojok kiri bawah (dekat huruf terakhir): ke atas, serong, lalu ke kanan
const sparkStrokes: Stroke[] = [
    { d: "M10 18C9 12 9 8 10 3", width: 2.75, order: 0 },
    { d: "M18 23C22 18 27 13 33 8", width: 2.75, order: 1 },
    { d: "M23 32C28 31 32 31 37 31", width: 2.75, order: 2 },
];

// Batang sedikit bergelombang + goresan tipis kedua, lalu dua sisi kepala panah yang ujungnya kebablasan
const arrowStrokes: Stroke[] = [
    { d: "M3 13C12 11 22 13 31 11S41 11 45 12", width: 2.75, order: 0 },
    { d: "M9 15C18 14 27 15 37 13", width: 1.25, order: 1 },
    { d: "M34 4C38 7 42 10 46 12", width: 2.75, order: 1 },
    { d: "M46 11C42 15 38 18 33 21", width: 2.75, order: 2 },
];

// Panah kanan yang dicerminkan pada garis diagonal (x dan y ditukar), jadi ujungnya menghadap ke bawah
const arrowDownStrokes: Stroke[] = [
    { d: "M13 3C11 12 13 22 11 31S11 41 12 45", width: 2.75, order: 0 },
    { d: "M15 9C14 18 15 27 13 37", width: 1.25, order: 1 },
    { d: "M4 34C7 38 10 42 12 46", width: 2.75, order: 1 },
    { d: "M11 46C15 42 18 38 21 33", width: 2.75, order: 2 },
];

// Sama seperti sisi bingkai siku: goresan tebal lalu goresan tipis yang sedikit bergeser
const lineStrokes: Stroke[] = [
    { d: "M2 5C70 3 160 7 298 4", width: 3, order: 0 },
    { d: "M12 9C90 7 190 10 284 7", width: 1.5, order: 1 },
];

// lineStrokes yang dicerminkan pada garis diagonal (x dan y ditukar), jadi digambar dari atas ke bawah
const lineDownStrokes: Stroke[] = [
    { d: "M5 2C3 70 7 160 4 298", width: 3, order: 0 },
    { d: "M9 12C7 90 10 190 7 284", width: 1.5, order: 1 },
];

// Garis tipis pemisah baris tabel, sedikit bergelombang
const ruleStrokes: Stroke[] = [
    { d: "M2 6C60 4 140 8 210 5S280 6 298 5", width: 1.25, order: 0 },
];

const ruleDownStrokes: Stroke[] = [
    { d: "M6 2C4 60 8 140 5 210S6 280 5 298", width: 1.25, order: 0 },
];

// Skalakan setiap pasangan angka x y dari kotak viewBox ke ukuran piksel
function scalePath(d: string, sx: number, sy: number) {
    let i = 0;
    return d.replace(/-?\d*\.?\d+/g, (n) => (parseFloat(n) * (i++ % 2 === 0 ? sx : sy)).toFixed(1));
}

// Membungkus <svg> dengan span absolut (className = posisi, ukuran & warna). Ukuran span diukur, lalu goresan
// diskalakan ke piksel supaya (1) tebal garis selalu sama walau lebar kotak berubah-ubah dan (2) animasi
// stroke-dashoffset tergambar utuh. Goresan berurutan sesuai "order", jeda antar urutan = stagger.
// threshold = bagian span yang harus terlihat di layar sebelum mulai menggambar.
function SketchSvg({ strokes, viewBox, className, delay = 0, duration = 700, stagger = 200, threshold = 0.6 }: {
    strokes: Stroke[];
    viewBox: [number, number];
    className: string;
    delay?: number;
    duration?: number;
    stagger?: number;
    threshold?: number;
}) {
    const ref = useRef<HTMLSpanElement>(null);
    const [size, setSize] = useState<{ w: number; h: number } | null>(null);
    const [visible, setVisible] = useState(false);
    const [drawn, setDrawn] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        // offsetWidth/Height = ukuran sebelum rotate, jadi siku yang diputar tetap benar
        const resizeObserver = new ResizeObserver(() => setSize({ w: el.offsetWidth, h: el.offsetHeight }));
        resizeObserver.observe(el);

        const visibleObserver = new IntersectionObserver(
            ([entry]) => {
                if (!entry?.isIntersecting) return;
                setVisible(true);
                visibleObserver.disconnect();
            },
            { threshold },
        );
        visibleObserver.observe(el);

        return () => {
            resizeObserver.disconnect();
            visibleObserver.disconnect();
        };
    }, [threshold]);

    // Goresan baru muncul setelah ukurannya diketahui. Tunggu satu frame dalam keadaan belum tergambar,
    // baru mulai animasi; kalau langsung, browser melewatkan transisinya dan goresan muncul tanpa animasi.
    useEffect(() => {
        if (!visible || !size || drawn) return;
        let inner = 0;
        const outer = requestAnimationFrame(() => {
            inner = requestAnimationFrame(() => setDrawn(true));
        });
        return () => {
            cancelAnimationFrame(outer);
            cancelAnimationFrame(inner);
        };
    }, [visible, size, drawn]);

    const [vbW, vbH] = viewBox;

    return(
        <span ref={ref} aria-hidden="true" className={`pointer-events-none absolute ${className}`}>
            {size && size.w > 0 && (
                <svg
                    className="block overflow-visible"
                    width={size.w}
                    height={size.h}
                    viewBox={`0 0 ${size.w} ${size.h}`}
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    {strokes.map((stroke) => (
                        <path
                            key={stroke.d}
                            d={scalePath(stroke.d, size.w / vbW, size.h / vbH)}
                            strokeWidth={stroke.width}
                            // pathLength 1 + dasharray 1: dashoffset 1 = belum tergambar, 0 = tergambar penuh
                            pathLength={1}
                            style={{ transitionDelay: `${delay + stroke.order * stagger}ms`, transitionDuration: `${duration}ms` }}
                            className={`[stroke-dasharray:1] transition-[stroke-dashoffset] ease-out motion-reduce:transition-none ${
                                drawn ? "[stroke-dashoffset:0]" : "[stroke-dashoffset:1] motion-reduce:[stroke-dashoffset:0]"
                            }`}
                        />
                    ))}
                </svg>
            )}
        </span>
    )
}
