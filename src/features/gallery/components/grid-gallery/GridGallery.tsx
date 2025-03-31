"use client";
import * as SanityTypes from "@/@types";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import Image from "next/image";
import styles from "./style.module.css";
import { useState } from "react";
import { motion } from "framer-motion";

type GridGalleryProps = {
    images: {
        art: SanityTypes.Art;
        src: string;
        width: number;
        height: number;
        alt: string;
        caption: string;
        category: string;
        blurDataURL: string;
        title: string;
    }[];
};

const GridGallery = ({ images }: GridGalleryProps) => {
    //const [isLoading, setIsLoading] = useState(true);
    const numColumns = 3;
    const [curCategory, setCurCategory] = useState("Drawings");
    const [itemHovered, setItemHovered] = useState(-1);
    const [loadedImages, setLoadedImages] = useState<{
        [url: string]: boolean;
    }>({});

    const handleImageLoad = (url: string) => {
        setLoadedImages((prev) => ({
            ...prev,
            [url]: true, // Mark this image as loaded
        }));
    };

    const handleCategory = (category: string) => {
        setCurCategory(category);
    };

    return (
        <section className={styles.container}>
            <section className={styles.buttonContainer}>
                <button
                    className={styles.button2}
                    onClick={() => handleCategory("Drawings")}
                >
                    Juni
                </button>
                <button
                    className={styles.button3}
                    onClick={() => handleCategory("Digital Art")}
                >
                    Latebis
                </button>
            </section>
            <section className={styles.imageContainer}>
                <ResponsiveMasonry
                    columnsCountBreakPoints={{ 768: 3, 1024: 4 }}
                >
                    <Masonry columnsCount={numColumns} gutter="10px">
                        {images.map(
                            (image, i) =>
                                curCategory === image.category && (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0 }}
                                        whileInView={{ opacity: 1 }}
                                        transition={{ duration: 0 }}
                                        viewport={{ once: true, amount: 0.5 }}
                                        onMouseEnter={() => setItemHovered(i)}
                                        onMouseLeave={() => setItemHovered(-1)}
                                        className={`${
                                            itemHovered === i
                                                ? styles.hovered
                                                : styles.notHovered
                                        } ${styles.imageWrapper} ${
                                            loadedImages[image.src]
                                                ? styles.loaded
                                                : styles.notLoaded
                                        }`}
                                    >
                                        <div
                                            className={`${styles.caption} ${itemHovered === i && styles.captionHovered}`}
                                        >
                                            {image.title}
                                        </div>
                                        <Image
                                            key={i}
                                            src={image.src}
                                            style={{
                                                width: "100%",
                                                height: "auto",
                                                display: "block",
                                            }}
                                            width={image.width / 5}
                                            height={image.height / 5}
                                            alt={image.alt}
                                            placeholder="blur"
                                            blurDataURL={image.blurDataURL}
                                            quality={40}
                                            onLoad={() =>
                                                handleImageLoad(image.src)
                                            }
                                        />
                                    </motion.div>
                                )
                        )}
                    </Masonry>
                </ResponsiveMasonry>
            </section>
        </section>
    );
};

export default GridGallery;
