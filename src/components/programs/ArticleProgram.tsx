import DetailArticle from "../DetailArticle";
import type { ProgramDetail } from "../../data/programs";

export default function ArticleProgram({ program }: { program: ProgramDetail }) {
    return(
        <DetailArticle
            crumbs={[{ label: "Program Unggulan" }]}
            eyebrow="Program Unggulan"
            title={program.title}
            description={program.description}
            image={program.image}
            icon={program.icon}
            meta={[
                { icon: "users", label: program.audience },
                { icon: "calendar", label: program.schedule },
            ]}
            body={program.body}
        />
    )
}
