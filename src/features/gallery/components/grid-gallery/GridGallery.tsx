"use client";
import * as SanityTypes from "@/@types";
import Masonry from "react-responsive-masonry";
import Image from "next/image";
import styles from "./style.module.css";
import { useEffect, useState, CSSProperties } from "react";
import { motion } from "framer-motion";
import ClipLoader from "react-spinners/ClipLoader";

const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
};

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
    const [isLoading, setIsLoading] = useState(true);
    const color = "ffffff";
    const [numColumns, setNumColumns] = useState(3);
    const [curCategory, setCurCategory] = useState("All");
    const [itemHovered, setItemHovered] = useState(-1);
    // create useEffect that will change isLoading to false after 2 seconds
    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 2000);
        // set up a listener for the resize event
        function handleResize() {
            if (window.innerWidth < 768) {
                setNumColumns(3);
            } else if (window.innerWidth < 1024) {
                setNumColumns(4);
            } else {
                setNumColumns(5);
            }
        }
        // add the event listener
        window.addEventListener("resize", handleResize);
        // remove the event listener
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const handleCategory = (category: string) => {
        setCurCategory(category);
    };

    return (
        <section className={styles.container}>
            <section className={styles.buttonContainer}>
                <button
                    className={styles.button1}
                    onClick={() => handleCategory("All")}
                >
                    All
                </button>
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
                <Masonry columnsCount={numColumns} gutter="10px">
                    {isLoading && (
                        <section
                            className={`${styles.loader} ${!isLoading && styles.fade}`}
                        >
                            <ClipLoader
                                color={color}
                                loading={isLoading}
                                cssOverride={override}
                                size={150}
                                aria-label="Loading Spinner"
                                data-testid="loader"
                                speedMultiplier={0.5}
                            />
                        </section>
                    )}
                    {images.map(
                        (image, i) =>
                            (curCategory === "All" ||
                                curCategory === image.category) && ( // <-- Fixed grouping
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    transition={{ duration: 0 }}
                                    onMouseEnter={() => setItemHovered(i)}
                                    onMouseLeave={() => setItemHovered(-1)}
                                    className={`${
                                        itemHovered === i
                                            ? styles.hovered
                                            : styles.notHovered
                                    } ${styles.imageWrapper}`}
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
                                        width={image.width}
                                        height={image.height}
                                        alt={image.alt}
                                        placeholder="blur"
                                        blurDataURL={image.blurDataURL}
                                        quality={50}
                                    />
                                </motion.div>
                            )
                    )}
                </Masonry>
            </section>
        </section>
    );
};

export default GridGallery;
