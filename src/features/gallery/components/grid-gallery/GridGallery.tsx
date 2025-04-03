"use client";
import * as SanityTypes from "@/@types";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import Image from "next/image";
import styles from "./style.module.css";
import { useState, useEffect } from "react";
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
    const [numColumns, setNumColumns] = useState(3);
    const [juniColumns, setJuniColumns] = useState<any[][]>([]);
    const [latebisColumns, setLatebisColumns] = useState<any[][]>([]);
    const [columns, setColumns] = useState<any[][]>([]);
    const [curCategory, setCurCategory] = useState("Drawings");
    const [itemHovered, setItemHovered] = useState(-1);
    const [loadedImages, setLoadedImages] = useState<{
        [url: string]: boolean;
    }>({});

    useEffect(() => {
        setColumns(distributeImages(images, numColumns));
        // get an array of only the images that are in the "Drawings" category
        const drawings = images.filter(
            (image) => image.category === "Drawings"
        );
        setJuniColumns(distributeImages(drawings, numColumns));
        const latebis = images.filter(
            (image) => image.category === "Digital Art"
        );
        setLatebisColumns(distributeImages(latebis, numColumns));
        console.log("columns", distributeImages(images, numColumns));
    }, [numColumns]);

    const distributeImages = (images: any[], numColumns: number) => {
        const columns: any[][] = Array.from({ length: numColumns }, () => []);
        const columnHeights = Array(numColumns).fill(0); // Tracks cumulative height of each column

        images.forEach((image) => {
            // Find the column with the least height
            const minColumnIndex = columnHeights.indexOf(
                Math.min(...columnHeights)
            );

            // Place the image in that column
            columns[minColumnIndex].push(image);

            // Update the column's total height
            columnHeights[minColumnIndex] += image.height;
        });

        return columns;
    };

    // rearrange the images so that the image.title === "Mask Ideation" is the last image
    const rearrangedImages = images.sort((a, b) => {
        if (a.title === "Mask Ideation") return 1;
        if (b.title === "Mask Ideation") return -1;
        return 0;
    });

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
                    JUNI
                </button>
                <button
                    className={styles.button3}
                    onClick={() => handleCategory("Digital Art")}
                >
                    LATEBIS
                </button>
                <button
                    className={styles.button1}
                    onClick={() => handleCategory("Contact")}
                >
                    CONTACT
                </button>
            </section>
            <section className={styles.imageContainer}>
                {curCategory === "Contact" && <p>hi</p>}
                <section
                    className={styles.masonGrid}
                    style={{
                        display: "grid",
                        gridTemplateColumns: `repeat(${numColumns}, 1fr)`,
                        gap: "20px",
                    }}
                >
                    {latebisColumns.map((column, i) => (
                        <section className={styles.gridColumn} key={i}>
                            {column.map(
                                (image, i) =>
                                    curCategory === image.category && (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0 }}
                                            whileInView={{ opacity: 1 }}
                                            transition={{ duration: 0 }}
                                            viewport={{
                                                once: true,
                                                amount: 0.5,
                                            }}
                                            onMouseEnter={() =>
                                                setItemHovered(i)
                                            }
                                            onMouseLeave={() =>
                                                setItemHovered(-1)
                                            }
                                            className={`${
                                                itemHovered === i
                                                    ? styles.hovered
                                                    : styles.notHovered
                                            } ${styles.imageWrapper} ${
                                                loadedImages[image.src]
                                                    ? styles.loaded
                                                    : styles.notLoaded
                                            }`}
                                            style={{}}
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
                        </section>
                    ))}
                </section>
            </section>
        </section>
    );
};

export default GridGallery;
