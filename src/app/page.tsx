import styles from "./page.module.css";
import { Gallery, LogoHeading } from "@/features/gallery";

export default function Home() {
    return (
        <div className={styles.page}>
            <section className={styles.headingSection}>
                <LogoHeading />
            </section>
            <section className={styles.gallerySection}>
                <Gallery />
            </section>
        </div>
    );
}
