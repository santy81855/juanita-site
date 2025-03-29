import styles from "./style.module.css";
import { client } from "@/sanity/lib/client";
import * as SanityTypes from "@/@types";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";

async function getArt() {
    const query = `
    *[_type == 'art']`;

    return await client.fetch(query);
}

const Gallery = async () => {
    const art: SanityTypes.Art[] = await getArt();
    return (
        <section className={styles.container}>
            {art.map((art: SanityTypes.Art, key: number) => {
                return (
                    <Image
                        className={styles.image}
                        objectFit="contain"
                        key={key}
                        src={urlFor(art.image).url() || ""}
                        alt={art.title}
                        fill
                    />
                );
            })}
        </section>
    );
};

export default Gallery;
