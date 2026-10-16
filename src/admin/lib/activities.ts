import type { ActivityCategory } from "../../data/activities";

// Teks & alamat halaman admin untuk tiap kategori kegiatan. Talent Day & ekskul memakai halaman yang sama
export const activityAdmin: Record<ActivityCategory, {
    path: string;       // alamat daftar di panel admin
    title: string;      // judul halaman daftar
    noun: string;       // sebutan satu item, huruf kecil
    description: string;
    example: string;    // contoh nama di form
}> = {
    talent_day: {
        path: "/admin/talent-day",
        title: "Talent Day",
        noun: "kelas Talent Day",
        description: "Kelas minat pilihan siswa (masak, bahasa Inggris, programming, dll.). Tampil sebagai slide Talent Day di beranda (di bawah Ekstrakurikuler) dan di halaman Kegiatan Siswa sesuai urutan di bawah, masing-masing dengan halaman detail sendiri.",
        example: "Contoh: Tata Boga",
    },
    ekskul: {
        path: "/admin/ekskul",
        title: "Ekstrakurikuler",
        noun: "ekskul",
        description: "Ekskul olahraga, keagamaan, dan pramuka. Tampil sebagai slide Ekstrakurikuler di beranda (di atas Talent Day) dan di halaman Kegiatan Siswa sesuai urutan di bawah, masing-masing dengan halaman detail sendiri.",
        example: "Contoh: Futsal",
    },
};

export function activityListPath(category: ActivityCategory) {
    return `/admin/activities?category=${category}`;
}
