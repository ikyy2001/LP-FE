import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import HeroActivities from "../../components/activities/HeroActivities";
import ActivityListSection from "../../components/activities/ActivityListSection";
import { useActivities } from "../../lib/content";

// Daftar semua kegiatan siswa: Ekstrakurikuler lalu Talent Day (urutan sama dengan beranda)
export default function Activities() {
    const { activities, error, reload } = useActivities();
    const { hash } = useLocation();

    // Tautan "Lihat Semua" di beranda menuju /kegiatan#ekstrakurikuler atau #talent-day. ScrollToTop hanya
    // menggulung ke atas, jadi #hash ditangani sendiri, setelah kartunya ada supaya posisinya tidak bergeser lagi
    const loaded = activities !== undefined;
    useEffect(() => {
        if (hash && loaded) document.getElementById(hash.slice(1))?.scrollIntoView();
    }, [hash, loaded]);

    const byCategory = (category: string) => activities?.filter((activity) => activity.category === category);

    return(
        <>
            <Navbar />
            <main>
                <HeroActivities />
                <ActivityListSection
                    category="ekskul"
                    eyebrow="Olahraga · Keagamaan · Pramuka"
                    title="Ekstrakurikuler"
                    description="Tempat siswa menyalurkan hobi, menjaga kebugaran, memperdalam ilmu agama, dan melatih kepemimpinan."
                    items={byCategory("ekskul")}
                    error={error}
                    onRetry={reload}
                    className="bg-white"
                />
                <ActivityListSection
                    category="talent_day"
                    eyebrow="Kelas Minat Pilihan"
                    title="Talent Day"
                    description="Kelas minat di luar pelajaran jurusan. Siswa bebas memilih sesuai bakatnya dan belajar bersama teman dari jurusan lain."
                    items={byCategory("talent_day")}
                    error={error}
                    onRetry={reload}
                    className="bg-brand-softmist"
                />
            </main>
            <Footer />
        </>
    )
}
