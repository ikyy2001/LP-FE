import type { IconName } from "../components/Icon";
import type { NewsBlock } from "./news";

// Program unggulan diambil dari API (GET /api/programs) dan dikelola admin di panel /admin/program.
// Urutannya (sort_order) = urutan kartu di beranda
export type Program = {
    id: number;
    slug: string;         // dipakai di alamat halaman detail: /program/{slug}
    title: string;
    description: string;  // ringkasan di beranda, sekaligus paragraf pembuka di halaman detail
    icon: IconName;       // ditampilkan selama belum ada foto
    image: string | null; // URL foto
    audience: string;     // peserta program, tampil di bawah judul halaman detail
    schedule: string;     // waktu pelaksanaan, tampil di bawah judul halaman detail
    sort_order: number;
};

// Program lengkap dengan isi halaman detailnya (formatnya sama dengan isi berita)
export type ProgramDetail = Program & { body: NewsBlock[] };
