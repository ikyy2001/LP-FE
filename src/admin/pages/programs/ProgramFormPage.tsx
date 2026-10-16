import { useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AdminIcon from "../../components/AdminIcon";
import BlockEditor from "../../components/BlockEditor";
import Field from "../../components/Field";
import IconPicker from "../../components/IconPicker";
import ImageInput from "../../components/ImageInput";
import PageHeader from "../../components/PageHeader";
import PanelState from "../../components/PanelState";
import Spinner from "../../components/Spinner";
import { buttonPrimary, buttonSecondary, cardClass, inputClass } from "../../components/ui";
import { useToast } from "../../toast/toast-context";
import { fromEditorBlocks, toEditorBlocks } from "../../lib/blocks";
import { slugify, useDocumentTitle } from "../../lib/format";
import { appendImage, emptyImageValue, scrollToFirstError } from "../../lib/forms";
import type { IconName } from "../../../components/Icon";
import type { ProgramDetail } from "../../../data/programs";
import { ApiError, apiRequest, type Resource } from "../../../lib/api";
import { invalidateApiCache, useApi } from "../../../lib/useApi";

// /admin/program/baru = tambah program, /admin/program/{id} = edit program
export default function ProgramFormPage() {
    const { id } = useParams();
    const isNew = id === undefined;
    useDocumentTitle(isNew ? "Tambah Program" : "Edit Program");
    const { data, error, reload, refreshing } = useApi<Resource<ProgramDetail>>(isNew ? null : `/admin/programs/${id}`);

    // Tunggu data terbaru: form diisi sekali saat dibuka, jadi data lama dari cache tidak boleh ikut terisi
    if (!isNew && (!data || refreshing)) {
        return(
            <>
                <PageHeader title="Edit Program" back={{ to: "/admin/program", label: "Semua program" }} />
                <PanelState error={error} onRetry={reload} label="Memuat program" />
            </>
        )
    }

    return <ProgramForm key={id ?? "baru"} program={data?.data ?? null} />;
}

function ProgramForm({ program }: { program: ProgramDetail | null }) {
    const navigate = useNavigate();
    const toast = useToast();

    const [title, setTitle] = useState(program?.title ?? "");
    const [slug, setSlug] = useState(program?.slug ?? "");
    const [description, setDescription] = useState(program?.description ?? "");
    const [audience, setAudience] = useState(program?.audience ?? "");
    const [schedule, setSchedule] = useState(program?.schedule ?? "");
    const [icon, setIcon] = useState<IconName>(program?.icon ?? "award");
    const [blocks, setBlocks] = useState(() => toEditorBlocks(program?.body ?? [""]));
    const [image, setImage] = useState(emptyImageValue);
    const [errors, setErrors] = useState<Record<string, string[]>>({});
    const [saving, setSaving] = useState(false);

    const err = (key: string) => errors[key]?.[0];

    const submit = async (e: FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setErrors({});

        const form = new FormData();
        if (program) form.append("_method", "PUT");
        form.append("title", title.trim());
        form.append("slug", slug.trim());
        form.append("description", description.trim());
        form.append("audience", audience.trim());
        form.append("schedule", schedule.trim());
        form.append("icon", icon);
        form.append("body", JSON.stringify(fromEditorBlocks(blocks)));
        appendImage(form, image);

        try {
            await apiRequest(program ? `/admin/programs/${program.id}` : "/admin/programs", { method: "POST", body: form });
            invalidateApiCache();
            toast.success(program ? "Perubahan program disimpan." : "Program unggulan ditambahkan.");
            navigate("/admin/program");
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

    const saveLabel = program ? "Simpan Perubahan" : "Tambah Program";

    return(
        <form onSubmit={submit} noValidate>
            <PageHeader
                title={program ? "Edit Program" : "Tambah Program"}
                back={{ to: "/admin/program", label: "Semua program" }}
                description={program && (
                    <a href={`/program/${program.slug}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-medium text-brand-darkred hover:underline">
                        Lihat di situs <AdminIcon name="external" className="w-3.5 h-3.5" />
                    </a>
                )}
                actions={
                    <>
                        <Link to="/admin/program" className={buttonSecondary}>Batal</Link>
                        <button type="submit" disabled={saving} className={buttonPrimary}>
                            {saving && <Spinner className="w-4 h-4" label="Menyimpan" />}
                            {saveLabel}
                        </button>
                    </>
                }
            />

            <div className="grid gap-6 lg:grid-cols-[1fr_20rem] lg:items-start">
                <div className={`${cardClass} min-w-0 space-y-6 p-5 sm:p-6`}>
                    <Field label="Nama Program" htmlFor="title" error={err("title")}>
                        <input id="title" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={255} aria-invalid={err("title") ? true : undefined} className={`${inputClass} text-base font-semibold`} placeholder="Contoh: Kelas Industri" />
                    </Field>

                    <Field
                        label="Alamat Halaman"
                        htmlFor="slug"
                        error={err("slug")}
                        hint={program ? "Mengubah alamat membuat tautan lama tidak berlaku lagi." : "Kosongkan untuk dibuat otomatis dari nama program."}
                    >
                        <div className={`flex items-center rounded-xl border bg-white focus-within:border-brand-darkred focus-within:ring-4 focus-within:ring-brand-darkred/10 ${err("slug") ? "border-brand-signal" : "border-brand-ink/15"}`}>
                            <span className="shrink-0 pl-4 text-sm text-brand-ink/45">/program/</span>
                            <input
                                id="slug"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                placeholder={slugify(title) || "alamat-program"}
                                maxLength={255}
                                aria-invalid={err("slug") ? true : undefined}
                                className="min-w-0 flex-1 rounded-r-xl bg-transparent py-2.5 pr-4 text-sm focus:outline-none"
                            />
                        </div>
                    </Field>

                    <Field label="Ringkasan" htmlFor="description" error={err("description")} hint="Tampil di kartu beranda dan sebagai paragraf pembuka halaman detail.">
                        <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} maxLength={1000} aria-invalid={err("description") ? true : undefined} className={`${inputClass} field-sizing-content min-h-24 leading-relaxed`} />
                    </Field>

                    <div className="grid gap-6 sm:grid-cols-2">
                        <Field label="Peserta" htmlFor="audience" error={err("audience")}>
                            <input id="audience" value={audience} onChange={(e) => setAudience(e.target.value)} maxLength={255} placeholder="Contoh: Siswa kelas XI & XII" aria-invalid={err("audience") ? true : undefined} className={inputClass} />
                        </Field>
                        <Field label="Jadwal" htmlFor="schedule" error={err("schedule")}>
                            <input id="schedule" value={schedule} onChange={(e) => setSchedule(e.target.value)} maxLength={255} placeholder="Contoh: Dua kali sepekan" aria-invalid={err("schedule") ? true : undefined} className={inputClass} />
                        </Field>
                    </div>

                    <div>
                        <p className="text-sm font-semibold">Isi Halaman Detail</p>
                        <p className="mt-1 mb-3 text-xs text-brand-ink/55">Jelaskan program dengan paragraf, subjudul, kutipan, dan daftar poin.</p>
                        <BlockEditor id="body" blocks={blocks} onChange={setBlocks} errors={errors} />
                    </div>
                </div>

                <div className="space-y-6">
                    <section className={`${cardClass} p-5`} aria-labelledby="image-heading">
                        <h2 id="image-heading" className="mb-4 font-semibold">Foto</h2>
                        <ImageInput id="image" currentUrl={program?.image ?? null} value={image} onChange={setImage} error={err("image")} aspect="aspect-4/3" />
                    </section>

                    <section className={`${cardClass} p-5`}>
                        <h2 id="icon-heading" className="font-semibold">Ikon</h2>
                        <p className="mt-1 mb-4 text-xs text-brand-ink/55">Ditampilkan di situs selama program belum punya foto.</p>
                        <IconPicker value={icon} onChange={setIcon} error={err("icon")} labelledBy="icon-heading" />
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
