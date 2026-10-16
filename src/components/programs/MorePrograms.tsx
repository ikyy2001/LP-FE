import MoreCards from "../MoreCards";
import type { Program } from "../../data/programs";

export default function MorePrograms({ items }: { items: Program[] }) {
    return(
        <MoreCards
            title="Program Lainnya"
            items={items.map((program) => ({
                key: program.slug,
                to: `/program/${program.slug}`,
                title: program.title,
                description: program.description,
                image: program.image,
                icon: program.icon,
            }))}
        />
    )
}
