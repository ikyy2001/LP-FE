import { majors } from "./majors";

export type MenuLink = {
    label: string;
    href: string;
    external?: boolean; // PPDB & BKK aplikasi terpisah, jadi halamannya dimuat ulang dari server
};

export type MenuGroup = {
    label: string;
    links: MenuLink[];
};

// TODO: ganti href dengan URL lengkap kalau PPDB & BKK dipasang di domain/subdomain lain
export const ppdbLink: MenuLink = { label: "Daftar PPDB", href: "/ppdb", external: true };

export const whatsappUrl = "https://wa.me/6281210868958";

export const navItems: (MenuLink | MenuGroup)[] = [
    { label: "Beranda", href: "/" },
    {
        label: "Profil",
        links: [
            { label: "Tentang Kami", href: "/tentang" },
            { label: "Profil Guru", href: "/profil-guru" },
            { label: "Fasilitas", href: "/fasilitas" },
            { label: "Ekskul & Talent Day", href: "/kegiatan" },
        ],
    },
    {
        label: "Jurusan",
        links: majors.map((major) => ({
            label: `${major.highlight} ${major.rest}`.trim(),
            href: `/jurusan/${major.slug}`,
        })),
    },
    { label: "Berita", href: "/berita" },
    { label: "BKK", href: "/bkk", external: true },
];
