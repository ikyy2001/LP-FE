import { useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AdminIcon from "../../components/AdminIcon";
import BlockEditor from "../../components/BlockEditor";
import Field from "../../components/Field";
import ImageInput from "../../components/ImageInput";
import PageHeader from "../../components/PageHeader";
import PanelState from "../../components/PanelState";
import Spinner from "../../components/Spinner";
import { buttonPrimary, buttonSecondary, cardClass, inputClass } from "../../components/ui";
import { useToast } from "../../toast/toast-context";
import { activityAdmin } from "../../lib/activities";
import { fromEditorBlocks, toEditorBlocks } from "../../lib/blocks";
import { slugify, useDocumentTitle } from "../../lib/format";
import { appendImage, emptyImageValue, scrollToFirstError } from "../../lib/forms";
import type { IconName } from "../../../components/Icon";
import { activityCategoryLabels, type ActivityCategory, type ActivityDetail } from "../../../data/activities";
import { ApiError, apiRequest, type Resource } from "../../../lib/api";
import { invalidateApiCache, useApi } from "../../../lib/useApi";

// {path}/baru = tambah, {path}/{id} = edit. category = halaman asal (Talent Day atau ekskul)
export default function ActivityFormPage({ category }: { category: ActivityCategory }) {
    const { id } = useParams();
    const isNew = id === undefined;
    const config = activityAdmin[category];
    useDocumentTitle(isNew ? `Tambah ${config.title}` : `Edit ${config.title}`);
    const { data, error, reload, refreshing } = useApi<Resource<ActivityDetail>>(isNew ? null : `/admin/activities/${id}`);

    // Tunggu data terbaru: form diisi sekali saat dibuka, jadi data lama dari cache tidak boleh ikut terisi
    if (!isNew && (!data || refreshing)) {
        return(
            <>
                <PageHeader title={`Edit ${config.title}`} back={{ to: config.path, label: `Semua ${config.noun}` }} />
                <PanelState error={error} onRetry={reload} label={`Memuat ${config.noun}`} />
            </>
        )
    }

    return <ActivityForm key={id ?? "baru"} activity={data?.data ?? null} category={category} />;
}

function ActivityForm({ activity, category: pageCategory }: { activity: ActivityDetail | null; category: ActivityCategory }) {
    const navigate = useNavigate();
    const toast = useToast();
    const config = activityAdmin[pageCategory];

    const [category, setCategory] = useState<ActivityCategory>(activity?.category ?? pageCategory);
    const [title, setTitle] = useState(activity?.title ?? "");
    const [slug, setSlug] = useState(activity?.slug ?? "");
    const [description, setDescription] = useState(activity?.description ?? "");
    const [schedule, setSchedule] = useState(activity?.schedule ?? "");
    // Isi halaman detail boleh kosong: halaman detail cukup menampilkan deskripsi
    const [blocks, setBlocks] = useState(() => toEditorBlocks(activity?.body ?? []));
    // Ikon tidak tampil di beranda (slide tanpa foto memakai foto Program Unggulan), jadi tidak ditampilkan di form.
    // Tetap dikirim karena wajib di server: nilai lama dipertahankan, item baru memakai ikon bawaan kategorinya
    const icon: IconName = activity?.icon ?? (category === "ekskul" ? "ball" : "bulb");
    const [image, setImage] = useState(emptyImageValue);
    const [errors, setErrors] = useState<Record<string, string[]>>({});
    const [saving, setSaving] = useState(false);

    const err = (key: string) => errors[key]?.[0];

    const submit = async (e: FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setErrors({});

        const form = new FormData();
        if (activity) form.append("_method", "PUT");
        form.append("category", category);
        form.append("title", title.trim());
        form.append("slug", slug.trim());
        form.append("description", description.trim());
        form.append("schedule", schedule.trim());
        form.append("icon", icon);
        form.append("body", JSON.stringify(fromEditorBlocks(blocks)));
        appendImage(form, image);

        try {
            await apiRequest(activity ? `/admin/activities/${activity.id}` : "/admin/activities", { method: "POST", body: form });
            invalidateApiCache();
            toast.success(activity ? "Perubahan disimpan." : `${activityCategoryLabels[category]} "${title.trim()}" ditambahkan.`);
            // Kembali ke daftar kategori tempat item ini sekarang berada
            navigate(activityAdmin[category].path);
        } catch (error) {
            if (error instanceof ApiError) {
                setErrors(error.errors);
                toast.error(error.status === 422 ? "Periksa kembali isian yang ditandai merah." : error.message);
                scrollToFirstError();
            }
        } finally {
            setSaving(false);
        }
    };

    const saveLabel = activity ? "Simpan Perubahan" : `Tambah ${config.title}`;

    return(
        <form onSubmit={submit} noValidate>
            <PageHeader
                title={activity ? `Edit ${config.title}` : `Tambah ${config.title}`}
                back={{ to: config.path, label: `Semua ${config.noun}` }}
                description={activity && (
                    <a href={`/kegiatan/${activity.slug}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-medium text-brand-darkred hover:underline">
                        Lihat di situs <AdminIcon name="external" className="w-3.5 h-3.5" />
                    </a>
                )}
                actions={
                    <>
                        <Link to={config.path} className={buttonSecondary}>Batal</Link>
                        <button type="submit" disabled={saving} className={buttonPrimary}>
                            {saving && <Spinner className="w-4 h-4" label="Menyimpan" />}
                            {saveLabel}
                        </button>
                    </>
                }
            />

            <div className="grid gap-6 lg:grid-cols-[1fr_20rem] lg:items-start">
                <div className={`${cardClass} min-w-0 space-y-6 p-5 sm:p-6`}>
                    <Field label="Nama" htmlFor="title" error={err("title")}>
                        <input id="title" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={255} aria-invalid={err("title") ? true : undefined} className={`${inputClass} text-base font-semibold`} placeholder={config.example} />
                    </Field>

                    <Field
                        label="Alamat Halaman"
                        htmlFor="slug"
                        error={err("slug")}
                        hint={activity ? "Mengubah alamat membuat tautan lama tidak berlaku lagi." : "Kosongkan untuk dibuat otomatis dari nama."}
                    >
                        <div className={`flex items-center rounded-xl border bg-white focus-within:border-brand-darkred focus-within:ring-4 focus-within:ring-brand-darkred/10 ${err("slug") ? "border-brand-signal" : "border-brand-ink/15"}`}>
                            <span className="shrink-0 pl-4 text-sm text-brand-ink/45">/kegiatan/</span>
                            <input
                                id="slug"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                placeholder={slugify(title) || "alamat-kegiatan"}
                                maxLength={255}
                                aria-invalid={err("slug") ? true : undefined}
                                className="min-w-0 flex-1 rounded-r-xl bg-transparent py-2.5 pr-4 text-sm focus:outline-none"
                            />
                        </div>
                    </Field>

                    <Field label="Deskripsi" htmlFor="description" error={err("description")} hint="Satu sampai dua kalimat. Tampil di slide beranda, kartu daftar kegiatan, dan sebagai paragraf pembuka halaman detail.">
                        <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} maxLength={1000} aria-invalid={err("description") ? true : undefined} className={`${inputClass} field-sizing-content min-h-24 leading-relaxed`} />
                    </Field>

                    <div className="grid gap-6 sm:grid-cols-2">
                        <Field label="Jadwal" htmlFor="schedule" optional error={err("schedule")} hint="Kosongkan kalau jadwalnya belum pasti.">
                            <input id="schedule" value={schedule} onChange={(e) => setSchedule(e.target.value)} maxLength={255} placeholder="Contoh: Setiap Jumat, 14.00" aria-invalid={err("schedule") ? true : undefined} className={inputClass} />
                        </Field>
                        <Field label="Tampil di Section" htmlFor="category" error={err("category")} hint={activity ? "Item yang dipindah ditaruh di urutan terakhir section tujuannya." : undefined}>
                            <select id="category" value={category} onChange={(e) => setCategory(e.target.value as ActivityCategory)} aria-invalid={err("category") ? true : undefined} className={inputClass}>
                                {(Object.keys(activityCategoryLabels) as ActivityCategory[]).map((value) => (
                                    <option key={value} value={value}>{activityCategoryLabels[value]}</option>
                                ))}
                            </select>
                        </Field>
                    </div>

                    <div>
                        <p className="text-sm font-semibold">Isi Halaman Detail <span className="ml-1.5 font-normal text-brand-ink/50">(opsional)</span></p>
                        <p className="mt-1 mb-3 text-xs text-brand-ink/55">Jelaskan kegiatannya dengan paragraf, subjudul, kutipan, dan daftar poin. Kosongkan kalau deskripsi saja sudah cukup.</p>
                        <BlockEditor id="body" blocks={blocks} onChange={setBlocks} errors={errors} />
                    </div>
                </div>

                <div className="space-y-6">
                    <section className={`${cardClass} p-5`} aria-labelledby="image-heading">
                        <h2 id="image-heading" className="mb-4 font-semibold">Foto</h2>
                        <ImageInput id="image" currentUrl={activity?.image ?? null} value={image} onChange={setImage} error={err("image")} aspect="aspect-4/3" emptyHint="Tanpa foto, slide di beranda memakai foto Program Unggulan." />
                    </section>

                    <button type="submit" disabled={saving} className={`${buttonPrimary} w-full py-3 lg:hidden`}>
                        {saving && <Spinner className="w-4 h-4" label="Menyimpan" />}
                        {saveLabel}
                    </button>
                </div>
            </div>
        </form>
    )
}
