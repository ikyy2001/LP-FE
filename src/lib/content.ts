import type { Resource } from "./api";
import { useApi } from "./useApi";
import type { Activity, ActivityDetail } from "../data/activities";
import type { Facility } from "../data/facilities";
import type { News, NewsCategory, NewsDetail } from "../data/news";
import type { Program, ProgramDetail } from "../data/programs";

// Hook untuk konten publik landing page. Semua memakai cache useApi, jadi aman dipanggil di banyak section.

export type NewsListResponse = { data: News[]; meta: { total: number } };
export type NewsDetailResponse = { data: NewsDetail; latest: News[]; related: News[] };
export type ProgramDetailResponse = { data: ProgramDetail; others: Program[] };
export type ActivityDetailResponse = { data: ActivityDetail; others: Activity[] };

export function useFacilities() {
    const { data, ...state } = useApi<Resource<Facility[]>>("/facilities");
    return { facilities: data?.data, ...state };
}

// Talent Day & ekskul diambil sekaligus, lalu dipisah per section di beranda
export function useActivities() {
    const { data, ...state } = useApi<Resource<Activity[]>>("/activities");
    return { activities: data?.data, ...state };
}

export function usePrograms() {
    const { data, ...state } = useApi<Resource<Program[]>>("/programs");
    return { programs: data?.data, ...state };
}

// offset & limit: halaman pertama daftar berita memuat satu berita lebih banyak (berita terbaru tampil besar)
export function useNewsList(category: NewsCategory | null, offset: number, limit: number) {
    const params = new URLSearchParams({ offset: String(offset), limit: String(limit) });
    if (category) params.set("category", category);

    return useApi<NewsListResponse>(`/news?${params}`);
}

export function useNewsDetail(slug: string | undefined) {
    return useApi<NewsDetailResponse>(slug ? `/news/${encodeURIComponent(slug)}` : null);
}

export function useProgramDetail(slug: string | undefined) {
    return useApi<ProgramDetailResponse>(slug ? `/programs/${encodeURIComponent(slug)}` : null);
}

export function useActivityDetail(slug: string | undefined) {
    return useApi<ActivityDetailResponse>(slug ? `/activities/${encodeURIComponent(slug)}` : null);
}
