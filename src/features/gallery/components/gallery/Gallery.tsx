import styles from "./style.module.css";
import { client } from "@/sanity/lib/client";
import * as SanityTypes from "@/@types";
import { urlFor } from "@/sanity/lib/image";
import { getImageDimensions } from "@sanity/asset-utils";
import GridGallery from "../grid-gallery/GridGallery";

async function getArt() {
    const query = `
    *[_type == 'art']`;

    return await client.fetch(query, undefined, { cache: "no-store" });
}

const Gallery = async () => {
    const art: SanityTypes.Art[] = await getArt();

    const images = art.map((art: SanityTypes.Art) => {
        return {
            art: art,
            src: urlFor(art.image).url(),
            width: getImageDimensions(art.image).width,
            height: getImageDimensions(art.image).height,
            alt: art.title,
            title: art.title,
            caption: art.description,
            category: art.category,
            blurDataURL: urlFor(art.image).width(10).height(10).blur(10).url(),
        };
    });

    return (
        <section className={styles.container}>
            <GridGallery
                images={images.sort((a, b) => {
                    if (a.title === "Mask Ideation") return 1;
                    if (b.title === "Mask Ideation") return -1;
                    return 0;
                })}
            />
        </section>
    );
};

export default Gallery;
