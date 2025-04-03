"use client";
import * as SanityTypes from "@/@types";
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
    const [itemHovered, setItemHovered] = useState([-1, -1]);
    const [loadedImages, setLoadedImages] = useState<{
        [url: string]: boolean;
    }>({});

    // useEffect to track window size and set number of columns
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 600) {
                setNumColumns(3);
            } else if (window.innerWidth < 2000) {
                setNumColumns(4);
            } else {
                setNumColumns(5);
            }
        };

        handleResize(); // Set initial number of columns
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

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
                {curCategory === "Drawings" && (
                    <section
                        className={styles.masonGrid}
                        style={{
                            display: "grid",
                            gridTemplateColumns: `repeat(${numColumns}, 1fr)`,
                            gap: "10px",
                        }}
                    >
                        {juniColumns.map((column, i) => (
                            <section className={styles.gridColumn} key={i}>
                                {column.map(
                                    (image, j) =>
                                        curCategory === image.category && (
                                            <motion.div
                                                key={`image-${i}-${j}`}
                                                initial={{ opacity: 0 }}
                                                whileInView={{ opacity: 1 }}
                                                transition={{ duration: 0 }}
                                                viewport={{
                                                    once: true,
                                                    amount: 0.5,
                                                }}
                                                onMouseEnter={() =>
                                                    setItemHovered([i, j])
                                                }
                                                onMouseLeave={() =>
                                                    setItemHovered([-1, -1])
                                                }
                                                className={`${
                                                    itemHovered[0] === i &&
                                                    itemHovered[1] === j
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
                                                    className={`${styles.caption} ${
                                                        itemHovered[0] === i &&
                                                        itemHovered[1] === j &&
                                                        styles.captionHovered
                                                    }`}
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
                                                    blurDataURL={
                                                        image.blurDataURL
                                                    }
                                                    quality={40}
                                                    onLoad={() =>
                                                        handleImageLoad(
                                                            image.src
                                                        )
                                                    }
                                                />
                                            </motion.div>
                                        )
                                )}
                            </section>
                        ))}
                    </section>
                )}
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
                                (image, j) =>
                                    curCategory === image.category && (
                                        <motion.div
                                            key={`image-${i}-${j}`}
                                            initial={{ opacity: 0 }}
                                            whileInView={{ opacity: 1 }}
                                            transition={{ duration: 0 }}
                                            viewport={{
                                                once: true,
                                                amount: 0.5,
                                            }}
                                            onMouseEnter={() =>
                                                setItemHovered([i, j])
                                            }
                                            onMouseLeave={() =>
                                                setItemHovered([-1, -1])
                                            }
                                            className={`${
                                                itemHovered[0] === i &&
                                                itemHovered[1] === j
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
                                                className={`${styles.caption} ${
                                                    itemHovered[0] === i &&
                                                    itemHovered[1] === j &&
                                                    styles.captionHovered
                                                }`}
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
