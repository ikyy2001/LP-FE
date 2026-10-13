import HeroHome from "../../components/home/HeroHome";
import IntroHome from "../../components/home/IntroHome";
import WhyHome from "../../components/home/WhyHome";
import MajorsHome from "../../components/home/MajorsHome";
import ProgramsHome from "../../components/home/ProgramsHome";
import FacilitiesHome from "../../components/home/FacilitiesHome";
import NewsHome from "../../components/home/NewsHome";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import PrincipalHome from "../../components/home/PrincipalHome";
import FaqHome from "../../components/home/FaqHome";
import ActivitiesHome from "../../components/home/ActivitiesHome";
import { useParallax, useSmoothScroll } from "../../lib/smoothScroll";
import { SketchProgress } from "../../components/SketchFrame";

export default function Home() {
    useSmoothScroll();
    // Elemen ber-atribut data-speed (foto kepala sekolah, video intro, kartu jurusan) bergeser pelan
    useParallax();

    return(
        <>
            <Navbar />
            <SketchProgress />
            <HeroHome />
            {/* Section setelah hero wajib "relative z-10" + background supaya bisa menutupi video */}
            <IntroHome />
            <WhyHome />
            <PrincipalHome />
            <MajorsHome />
            {/* Urutan: jurusan (keahlian utama) -> program sekolah -> kegiatan pilihan siswa (ekskul & Talent Day)
                -> fasilitas yang menunjang semuanya -> berita -> FAQ */}
            <ProgramsHome />
            <ActivitiesHome />
            <FacilitiesHome />
            <NewsHome />
            <FaqHome />
            <Footer />
        </>
    )
}
