import { useState } from "react";
import { Link } from "react-router-dom";
import AdminIcon from "../../components/AdminIcon";
import ConfirmDialog from "../../components/ConfirmDialog";
import PageHeader from "../../components/PageHeader";
import PanelState from "../../components/PanelState";
import Thumbnail from "../../components/Thumbnail";
import { buttonPrimary, cardClass, iconButton } from "../../components/ui";
import { useToast } from "../../toast/toast-context";
import { activityAdmin, activityListPath } from "../../lib/activities";
import { useDocumentTitle } from "../../lib/format";
import type { Activity, ActivityCategory } from "../../../data/activities";
import { ApiError, apiRequest, type Resource } from "../../../lib/api";
import { invalidateApiCache, setApiCache, useApi } from "../../../lib/useApi";

// Daftar Talent Day (/admin/talent-day) atau ekskul (/admin/ekskul), urutannya bisa diubah
export default function ActivityListPage({ category }: { category: ActivityCategory }) {
    const config = activityAdmin[category];
    useDocumentTitle(config.title);
    const toast = useToast();
    const listPath = activityListPath(category);
    const { data, error, reload } = useApi<Resource<Activity[]>>(listPath);
    const [pendingDelete, setPendingDelete] = useState<Activity | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [reordering, setReordering] = useState(false);
    const activities = data?.data;

    const move = async (index: number, offset: number) => {
        if (!activities) return;
        const ids = activities.map((activity) => activity.id);
        [ids[index], ids[index + offset]] = [ids[index + offset], ids[index]];

        setReordering(true);
        try {
            const reordered = await apiRequest<Resource<Activity[]>>("/admin/activities/reorder", { method: "POST", body: { category, ids } });
            invalidateApiCache();
            setApiCache(listPath, reordered);
        } catch (err) {
            toast.error(err instanceof ApiError ? err.message : "Gagal mengubah urutan.");
        } finally {
            setReordering(false);
        }
    };

    const confirmDelete = async () => {
        if (!pendingDelete) return;
        setDeleting(true);
        try {
            await apiRequest(`/admin/activities/${pendingDelete.id}`, { method: "DELETE" });
            invalidateApiCache();
            toast.success(`"${pendingDelete.title}" dihapus.`);
            setPendingDelete(null);
        } catch (err) {
            toast.error(err instanceof ApiError ? err.message : `Gagal menghapus ${config.noun}.`);
        } finally {
            setDeleting(false);
        }
    };

    return(
        <>
            <PageHeader
                title={config.title}
                description={config.description}
                actions={
                    <Link to={`${config.path}/baru`} className={buttonPrimary}>
                        <AdminIcon name="plus" className="w-4 h-4" />
                        Tambah {config.title}
                    </Link>
                }
            />

            {!activities ? (
                <PanelState error={error} onRetry={reload} label={`Memuat ${config.noun}`} />
            ) : activities.length === 0 ? (
                <div className={`${cardClass} px-6 py-16 text-center`}>
                    <p className="text-sm text-brand-ink/60">Belum ada {config.noun}. Slide {config.title} di beranda disembunyikan sampai ada isinya.</p>
                    <Link to={`${config.path}/baru`} className={`${buttonPrimary} mt-4`}>Tambah {config.title} Pertama</Link>
                </div>
            ) : (
                <ol className={`${cardClass} divide-y divide-brand-ink/10`} aria-busy={reordering}>
                    {activities.map((activity, index) => (
                        <li key={activity.id} className="flex items-center gap-3 px-4 py-3 sm:gap-4 sm:px-5">
                            <span className="w-6 shrink-0 text-center font-display text-lg font-bold text-brand-ink/30">{index + 1}</span>
                            <span className="hidden sm:block"><Thumbnail src={activity.image} className="h-14 w-20" /></span>
                            <div className="min-w-0 flex-1">
                                <Link to={`${config.path}/${activity.id}`} className="text-sm font-semibold hover:text-brand-darkred">{activity.title}</Link>
                                <p className="mt-0.5 line-clamp-1 text-xs text-brand-ink/55">{activity.schedule ? `${activity.schedule} · ` : ""}{activity.description}</p>
                            </div>
                            <div className="flex shrink-0 items-center">
                                <button type="button" onClick={() => move(index, -1)} disabled={index === 0 || reordering} aria-label={`Naikkan "${activity.title}"`} title="Naikkan" className={iconButton}>
                                    <AdminIcon name="arrowUp" className="w-4 h-4" />
                                </button>
                                <button type="button" onClick={() => move(index, 1)} disabled={index === activities.length - 1 || reordering} aria-label={`Turunkan "${activity.title}"`} title="Turunkan" className={iconButton}>
                                    <AdminIcon name="arrowDown" className="w-4 h-4" />
                                </button>
                                <a href={`/kegiatan/${activity.slug}`} target="_blank" rel="noreferrer" aria-label={`Lihat "${activity.title}" di situs`} title="Lihat di situs" className={iconButton}>
                                    <AdminIcon name="external" className="w-4 h-4" />
                                </a>
                                <Link to={`${config.path}/${activity.id}`} aria-label={`Edit "${activity.title}"`} title="Edit" className={iconButton}>
                                    <AdminIcon name="pencil" className="w-4 h-4" />
                                </Link>
                                <button type="button" onClick={() => setPendingDelete(activity)} aria-label={`Hapus "${activity.title}"`} title="Hapus" className={`${iconButton} hover:bg-brand-signal/10 hover:text-brand-signal`}>
                                    <AdminIcon name="trash" className="w-4 h-4" />
                                </button>
                            </div>
                        </li>
                    ))}
                </ol>
            )}

            <ConfirmDialog
                open={pendingDelete !== null}
                title={`Hapus ${config.noun} ini?`}
                message={`"${pendingDelete?.title ?? ""}" beserta fotonya akan dihapus permanen dan halamannya tidak bisa dibuka lagi.`}
                busy={deleting}
                onConfirm={confirmDelete}
                onCancel={() => setPendingDelete(null)}
            />
        </>
    )
}
