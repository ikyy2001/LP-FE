import { useState } from "react";
import AdminIcon from "./AdminIcon";
import { buttonSecondary } from "./ui";
import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_BYTES, formatFileSize } from "../lib/format";
import type { ImageValue } from "../lib/forms";

// Foto tunggal (berita & program) dengan pratinjau. currentUrl = foto yang sudah tersimpan di server.
// URL pratinjau dibuat saat memilih berkas (event handler), bukan saat render.
// emptyHint = apa yang tampil di situs selama belum ada foto
export default function ImageInput({ id, currentUrl, value, onChange, error, aspect = "aspect-video", emptyHint = "Tanpa foto, situs menampilkan ikon." }: {
    id: string;
    currentUrl: string | null;
    value: ImageValue;
    onChange: (value: ImageValue) => void;
    error?: string;
    aspect?: string;
    emptyHint?: string;
}) {
    const [sizeError, setSizeError] = useState<string | null>(null);
    const shown = value.preview ?? (value.remove ? null : currentUrl);

    const pick = (file: File | undefined) => {
        if (!file) return;
        if (file.size > MAX_IMAGE_BYTES) {
            setSizeError(`Ukuran foto ${formatFileSize(file.size)}, maksimal 5 MB. Kecilkan dulu ukurannya.`);
            return;
        }
        setSizeError(null);
        if (value.preview) URL.revokeObjectURL(value.preview);
        onChange({ file, preview: URL.createObjectURL(file), remove: false });
    };

    const clear = () => {
        if (value.preview) URL.revokeObjectURL(value.preview);
        setSizeError(null);
        onChange({ file: null, preview: null, remove: currentUrl !== null });
    };

    const message = sizeError ?? error;

    return(
        <div>
            <div className={`relative overflow-hidden rounded-xl border ${message ? "border-brand-signal" : "border-brand-ink/10"} bg-brand-softmist/60 ${aspect}`}>
                {shown ? (
                    <img src={shown} alt="Pratinjau foto" className="absolute inset-0 h-full w-full object-cover" />
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-brand-ink/40">
                        <AdminIcon name="image" className="w-10 h-10" />
                        <span className="text-xs">Belum ada foto</span>
                    </div>
                )}
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
                <label htmlFor={id} className={`${buttonSecondary} cursor-pointer px-4 py-2 text-xs focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-brand-darkred`}>
                    <AdminIcon name="image" className="w-4 h-4" />
                    {shown ? "Ganti Foto" : "Pilih Foto"}
                    <input
                        id={id}
                        type="file"
                        accept={ACCEPTED_IMAGE_TYPES}
                        aria-invalid={message ? true : undefined}
                        onChange={(e) => {
                            pick(e.target.files?.[0]);
                            e.target.value = "";
                        }}
                        className="sr-only"
                    />
                </label>
                {shown && (
                    <button type="button" onClick={clear} className={`${buttonSecondary} px-4 py-2 text-xs text-brand-signal`}>
                        <AdminIcon name="trash" className="w-4 h-4" />
                        Hapus Foto
                    </button>
                )}
            </div>

            {message ? (
                <p className="mt-1.5 text-sm text-brand-signal">{message}</p>
            ) : (
                <p className="mt-1.5 text-xs text-brand-ink/55">JPG, PNG, atau WEBP, maksimal 5 MB. {emptyHint}</p>
            )}
        </div>
    )
}
