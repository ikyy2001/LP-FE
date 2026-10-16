import fotoProgram from "../assets/images/programUnggulan/Basket.jpeg";
import type { IconName } from "../components/Icon";
import type { NewsBlock } from "./news";

// Kegiatan pilihan siswa, diambil dari API (GET /api/activities) dan dikelola admin di panel
// /admin/talent-day & /admin/ekskul. Urutannya (sort_order) = urutan slide & kartu, dihitung per kategori.
// Daftar lengkapnya di /kegiatan, detailnya di /kegiatan/{slug}.
export type ActivityCategory = "talent_day" | "ekskul";

export type Activity = {
    id: number;
    slug: string;            // dipakai di alamat halaman detail: /kegiatan/{slug}
    category: ActivityCategory;
    title: string;
    description: string;     // ringkasan di slide & kartu, sekaligus paragraf pembuka halaman detail
    icon: IconName;
    image: string | null;    // URL foto
    schedule: string | null; // jadwal latihan, opsional
    sort_order: number;
};

// Kegiatan lengkap dengan isi halaman detailnya (formatnya sama dengan isi berita, boleh kosong)
export type ActivityDetail = Activity & { body: NewsBlock[] };

// talent_day = kelas minat (masak, bahasa Inggris, programming, ...), ekskul = olahraga, keagamaan & pramuka
export const activityCategoryLabels: Record<ActivityCategory, string> = {
    talent_day: "Talent Day",
    ekskul: "Ekstrakurikuler",
};

// id section di halaman /kegiatan, mis. /kegiatan#talent-day
export const activityCategoryAnchors: Record<ActivityCategory, string> = {
    talent_day: "talent-day",
    ekskul: "ekstrakurikuler",
};

// Kegiatan yang belum punya foto memakai foto Program Unggulan
export function activityImage(activity: Activity): string {
    return activity.image ?? fotoProgram;
}
