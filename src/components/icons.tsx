import type { ReactNode } from "react";

// Path SVG setiap ikon (viewBox 24x24, garis). Dipisah dari komponen Icon supaya daftar namanya bisa dipakai
// pemilih ikon di panel admin.
export const icons = {
    camera: (
        <>
            <path d="M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" />
            <circle cx="12" cy="13" r="3.5" />
        </>
    ),
    video: (
        <>
            <rect x="3" y="6" width="13" height="12" rx="2" />
            <path d="m16 10 5-3v10l-5-3" />
        </>
    ),
    pen: (
        <>
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
        </>
    ),
    code: <path d="m8 8-4 4 4 4M16 8l4 4-4 4M14 4l-4 16" />,
    monitor: (
        <>
            <rect x="3" y="4" width="18" height="12" rx="2" />
            <path d="M8 20h8M12 16v4" />
        </>
    ),
    phone: (
        <>
            <rect x="7" y="2" width="10" height="20" rx="2" />
            <path d="M11 18h2" />
        </>
    ),
    database: (
        <>
            <ellipse cx="12" cy="5" rx="8" ry="3" />
            <path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" />
        </>
    ),
    network: (
        <>
            <rect x="9" y="3" width="6" height="5" rx="1" />
            <rect x="3" y="16" width="6" height="5" rx="1" />
            <rect x="15" y="16" width="6" height="5" rx="1" />
            <path d="M12 8v4M6 16v-2h12v2" />
        </>
    ),
    server: (
        <>
            <rect x="3" y="4" width="18" height="7" rx="1.5" />
            <rect x="3" y="13" width="18" height="7" rx="1.5" />
            <path d="M7 7.5h.01M7 16.5h.01" />
        </>
    ),
    shield: (
        <>
            <path d="M12 3 4 6v6c0 4.5 3.4 8.2 8 9 4.6-.8 8-4.5 8-9V6l-8-3z" />
            <path d="m9 12 2 2 4-4" />
        </>
    ),
    bank: <path d="M3 10 12 4l9 6M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 21h18" />,
    calculator: (
        <>
            <rect x="5" y="3" width="14" height="18" rx="2" />
            <path d="M8 7h8M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01" />
        </>
    ),
    user: (
        <>
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21a8 8 0 0 1 16 0" />
        </>
    ),
    cpu: (
        <>
            <rect x="6" y="6" width="12" height="12" rx="2" />
            <rect x="9.5" y="9.5" width="5" height="5" />
            <path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4" />
        </>
    ),
    zap: <path d="M13 2 4 14h7l-1 8 9-12h-7z" />,
    briefcase: (
        <>
            <rect x="3" y="7" width="18" height="13" rx="2" />
            <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18" />
        </>
    ),
    factory: <path d="M3 21h18M5 21V9l5 3V9l5 3V5h4v16" />,
    award: (
        <>
            <circle cx="12" cy="9" r="5" />
            <path d="M9 13.5 8 21l4-2 4 2-1-7.5" />
        </>
    ),
    book: <path d="M4 19.5V5a2 2 0 0 1 2-2h14v18H6.5A2.5 2.5 0 0 1 4 18.5 2.5 2.5 0 0 1 6.5 16H20" />,
    globe: (
        <>
            <circle cx="12" cy="12" r="9" />
            <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
        </>
    ),
    bulb: <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.4 1 1.1 1 1.8V16h5v-.3c0-.7.4-1.4 1-1.8A6 6 0 0 0 12 3z" />,
    check: <path d="m5 12 5 5L20 7" />,
    headphones: (
        <>
            <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
            <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
        </>
    ),
    flask: <path d="M9 3h6M10 3v6l-5.5 9.5A1.7 1.7 0 0 0 6 21h12a1.7 1.7 0 0 0 1.5-2.5L14 9V3M7 15h10" />,
    mosque: (
        <>
            <path d="M12 2v2M3 21h18M5 21v-7h14v7" />
            <path d="M12 4c-3 2-5 4-5 7v3h10v-3c0-3-2-5-5-7z" />
            <path d="M10.5 21v-3a1.5 1.5 0 0 1 3 0v3" />
        </>
    ),
    mapPin: (
        <>
            <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" />
            <circle cx="12" cy="10" r="2.5" />
        </>
    ),
    mail: (
        <>
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="m3 7 9 6 9-6" />
        </>
    ),
    clock: (
        <>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" />
        </>
    ),
    calendar: (
        <>
            <rect x="3" y="5" width="18" height="16" rx="2" />
            <path d="M3 10h18M8 3v4M16 3v4" />
        </>
    ),
    link: <path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1 1M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1-1" />,
    instagram: (
        <>
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <path d="M17.5 6.5h.01" />
        </>
    ),
    youtube: (
        <>
            <rect x="2" y="5" width="20" height="14" rx="4" />
            <path d="m10 9 5 3-5 3z" />
        </>
    ),
    tiktok: <path d="M16 3a5 5 0 0 0 5 5M16 3v12a5 5 0 1 1-5-5" />,
    facebook: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />,
    whatsapp: <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5z" />,
    phoneCall: <path d="M3 5a2 2 0 0 1 2-2h3.3a1 1 0 0 1 .9.7l1.5 4.5a1 1 0 0 1-.5 1.2l-2.3 1.1a11 11 0 0 0 5.5 5.5l1.1-2.3a1 1 0 0 1 1.2-.5l4.5 1.5a1 1 0 0 1 .7 1V19a2 2 0 0 1-2 2h-1C9.7 21 3 14.3 3 6z" />,
    search: (
        <>
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
        </>
    ),
    play: <path d="M7 4.5v15l12.5-7.5z" />,
    pause: (
        <>
            <rect x="6" y="5" width="4" height="14" rx="1" />
            <rect x="14" y="5" width="4" height="14" rx="1" />
        </>
    ),
    externalLink: <path d="M10 6H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4M14 4h6v6M20 4 10 14" />,
    flag: <path d="M5 21V4M5 4h12l-2.5 4.5L17 13H5" />,
    users: (
        <>
            <circle cx="9" cy="8" r="3.5" />
            <path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14.2a6.5 6.5 0 0 1 3.5 5.8" />
        </>
    ),
    // Ikon kegiatan siswa (Talent Day & ekskul)
    cooking: <path d="M4 11h16v6a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3zM2 11h20M9.5 7.5c0-1.2 1-1.6 1-2.8M14.5 7.5c0-1.2 1-1.6 1-2.8" />,
    gamepad: (
        <>
            <path d="M7 7h10a5 5 0 0 1 4.8 6.4l-.7 2.4a2.4 2.4 0 0 1-4 1L15.5 15h-7L6.9 16.8a2.4 2.4 0 0 1-4-1l-.7-2.4A5 5 0 0 1 7 7z" />
            <path d="M8 10v3M6.5 11.5h3M15 11h.01M17.5 12.5h.01" />
        </>
    ),
    ball: (
        <>
            <circle cx="12" cy="12" r="9" />
            <path d="M3 12h18M12 3v18M5.6 5.6a9 9 0 0 1 0 12.8M18.4 5.6a9 9 0 0 0 0 12.8" />
        </>
    ),
    trophy: <path d="M8 4h8v5a4 4 0 0 1-8 0zM8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M8 21h8M9 17h6v4H9z" />,
    tent: <path d="M12 4 3 20h18zM12 13l-3 7M12 13l3 7M2 20h20" />,
} satisfies Record<string, ReactNode>;

export type IconName = keyof typeof icons;

export const iconNames = Object.keys(icons) as IconName[];
