import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import DetailArticle from "../../components/DetailArticle";
import MoreCards from "../../components/MoreCards";
import DetailPageState from "../../components/DetailPageState";
import NotFound from "../notfound/NotFound";
import { activityCategoryAnchors, activityCategoryLabels, activityImage } from "../../data/activities";
import { useActivityDetail } from "../../lib/content";

export default function ActivityDetail() {
    const { slug } = useParams();
    // others = tiga kegiatan berikutnya dari kategori yang sama, kembali ke awal setelah yang terakhir (disusun server)
    const { data, error, reload } = useActivityDetail(slug);

    if (error?.status === 404) return <NotFound />;
    if (!data) return <DetailPageState error={error} onRetry={reload} />;

    const activity = data.data;
    const label = activityCategoryLabels[activity.category];

    return(
        <>
            <Navbar />
            {/* key: animasi & coretan diulang saat pindah dari satu kegiatan ke kegiatan lain */}
            <main key={activity.slug}>
                <DetailArticle
                    crumbs={[
                        { label: "Kegiatan Siswa", to: "/kegiatan" },
                        { label, to: `/kegiatan#${activityCategoryAnchors[activity.category]}` },
                    ]}
                    eyebrow={label}
                    title={activity.title}
                    description={activity.description}
                    image={activityImage(activity)}
                    icon={activity.icon}
                    meta={[
                        { icon: activity.category === "ekskul" ? "flag" : "bulb", label: activity.category === "ekskul" ? "Ekskul pilihan siswa" : "Kelas minat pilihan siswa" },
                        ...(activity.schedule ? [{ icon: "calendar" as const, label: activity.schedule }] : []),
                    ]}
                    body={activity.body}
                />
                <MoreCards
                    title={`${label} Lainnya`}
                    items={data.others.map((other) => ({
                        key: other.slug,
                        to: `/kegiatan/${other.slug}`,
                        title: other.title,
                        description: other.description,
                        image: activityImage(other),
                        icon: other.icon,
                    }))}
                />
            </main>
            <Footer />
        </>
    )
}
