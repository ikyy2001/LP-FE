import { useState } from "react";
import { Link } from "react-router-dom";
import AdminIcon from "../../components/AdminIcon";
import ConfirmDialog from "../../components/ConfirmDialog";
import PageHeader from "../../components/PageHeader";
import PanelState from "../../components/PanelState";
import Thumbnail from "../../components/Thumbnail";
import { buttonPrimary, cardClass, iconButton } from "../../components/ui";
import { useToast } from "../../toast/toast-context";
import { useDocumentTitle } from "../../lib/format";
import type { Program } from "../../../data/programs";
import { ApiError, apiRequest, type Resource } from "../../../lib/api";
import { invalidateApiCache, setApiCache, useApi } from "../../../lib/useApi";

export default function ProgramListPage() {
    useDocumentTitle("Program Unggulan");
    const toast = useToast();
    const { data, error, reload } = useApi<Resource<Program[]>>("/admin/programs");
    const [pendingDelete, setPendingDelete] = useState<Program | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [reordering, setReordering] = useState(false);
    const programs = data?.data;

    const move = async (index: number, offset: number) => {
        if (!programs) return;
        const ids = programs.map((program) => program.id);
        [ids[index], ids[index + offset]] = [ids[index + offset], ids[index]];

        setReordering(true);
        try {
            const reordered = await apiRequest<Resource<Program[]>>("/admin/programs/reorder", { method: "POST", body: { ids } });
            invalidateApiCache();
            setApiCache("/admin/programs", reordered);
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
            await apiRequest(`/admin/programs/${pendingDelete.id}`, { method: "DELETE" });
            invalidateApiCache();
            toast.success(`Program "${pendingDelete.title}" dihapus.`);
            setPendingDelete(null);
        } catch (err) {
            toast.error(err instanceof ApiError ? err.message : "Gagal menghapus program.");
        } finally {
            setDeleting(false);
        }
    };

    return(
        <>
            <PageHeader
                title="Program Unggulan"
                description="Tampil sebagai kartu di beranda sesuai urutan di bawah, masing-masing dengan halaman detail sendiri."
                actions={
                    <Link to="/admin/program/baru" className={buttonPrimary}>
                        <AdminIcon name="plus" className="w-4 h-4" />
                        Tambah Program
                    </Link>
                }
            />

            {!programs ? (
                <PanelState error={error} onRetry={reload} label="Memuat program" />
            ) : programs.length === 0 ? (
                <div className={`${cardClass} px-6 py-16 text-center`}>
                    <p className="text-sm text-brand-ink/60">Belum ada program unggulan. Section Program Unggulan di beranda disembunyikan sampai ada program.</p>
                    <Link to="/admin/program/baru" className={`${buttonPrimary} mt-4`}>Tambah Program Pertama</Link>
                </div>
            ) : (
                <ol className={`${cardClass} divide-y divide-brand-ink/10`} aria-busy={reordering}>
                    {programs.map((program, index) => (
                        <li key={program.id} className="flex items-center gap-3 px-4 py-3 sm:gap-4 sm:px-5">
                            <span className="w-6 shrink-0 text-center font-display text-lg font-bold text-brand-ink/30">{index + 1}</span>
                            <span className="hidden sm:block"><Thumbnail src={program.image} className="h-14 w-20" /></span>
                            <div className="min-w-0 flex-1">
                                <Link to={`/admin/program/${program.id}`} className="text-sm font-semibold hover:text-brand-darkred">{program.title}</Link>
                                <p className="mt-0.5 line-clamp-1 text-xs text-brand-ink/55">{program.description}</p>
                            </div>
                            <div className="flex shrink-0 items-center">
                                <button type="button" onClick={() => move(index, -1)} disabled={index === 0 || reordering} aria-label={`Naikkan "${program.title}"`} title="Naikkan" className={iconButton}>
                                    <AdminIcon name="arrowUp" className="w-4 h-4" />
                                </button>
                                <button type="button" onClick={() => move(index, 1)} disabled={index === programs.length - 1 || reordering} aria-label={`Turunkan "${program.title}"`} title="Turunkan" className={iconButton}>
                                    <AdminIcon name="arrowDown" className="w-4 h-4" />
                                </button>
                                <a href={`/program/${program.slug}`} target="_blank" rel="noreferrer" aria-label={`Lihat "${program.title}" di situs`} title="Lihat di situs" className={iconButton}>
                                    <AdminIcon name="external" className="w-4 h-4" />
                                </a>
                                <Link to={`/admin/program/${program.id}`} aria-label={`Edit "${program.title}"`} title="Edit" className={iconButton}>
                                    <AdminIcon name="pencil" className="w-4 h-4" />
                                </Link>
                                <button type="button" onClick={() => setPendingDelete(program)} aria-label={`Hapus "${program.title}"`} title="Hapus" className={`${iconButton} hover:bg-brand-signal/10 hover:text-brand-signal`}>
                                    <AdminIcon name="trash" className="w-4 h-4" />
                                </button>
                            </div>
                        </li>
                    ))}
                </ol>
            )}

            <ConfirmDialog
                open={pendingDelete !== null}
                title="Hapus program ini?"
                message={`"${pendingDelete?.title ?? ""}" beserta fotonya akan dihapus permanen dan halamannya tidak bisa dibuka lagi.`}
                busy={deleting}
                onConfirm={confirmDelete}
                onCancel={() => setPendingDelete(null)}
            />
        </>
    )
}
