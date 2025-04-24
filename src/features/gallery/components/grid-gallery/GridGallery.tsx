"use client";
import * as SanityTypes from "@/@types";
import Image from "next/image";
import styles from "./style.module.css";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { backArrow, LoadingScreen, instagramColor } from "@/features/gallery";
import { send } from "@/actions/email";
import Link from "next/link";

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

type ImageItem = {
    art: SanityTypes.Art;
    src: string;
    width: number;
    height: number;
    alt: string;
    caption: string;
    category: string;
    blurDataURL: string;
    title: string;
};


type ArtPageProps = {
    category: string;
    images: ImageItem[][];
    numColumns: number;
    setItemHovered: React.Dispatch<React.SetStateAction<number[]>>;
    itemHovered: number[];
    loadedImages: { [url: string]: boolean };
    handleImageLoad: (url: string) => void;
};

const ArtPage = ({ category, images, numColumns, setItemHovered, itemHovered, loadedImages, handleImageLoad}: ArtPageProps) => {
    return (
            <section
                className={styles.masonGrid}
                style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${numColumns}, 1fr)`,
                    gap: "10px",
                }}
            >
                {images.map((column, i) => (
                    <section className={styles.gridColumn} key={i}>
                        {column.map((image, j) => (
                            <motion.div
                                key={`${category}-image-${i}-${j}`}
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ duration: 0 }}
                                viewport={{
                                    once: true,
                                    amount: 0.1,
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
                        ))}
                    </section>
                ))}
            </section>
    );
};

const GridGallery = ({ images }: GridGalleryProps) => {
    //const [isLoading, setIsLoading] = useState(true);
    const [numColumns, setNumColumns] = useState(3);
    const [juniColumns, setJuniColumns] = useState<ImageItem[][]>([]);
    const [latebisColumns, setLatebisColumns] = useState<ImageItem[][]>([]);
    const [pagesColumns, setPagesColumns] = useState<ImageItem[][]>([]);
    const [allColumns, setAllColumns] = useState<ImageItem[][]>([]);
    const [curCategory, setCurCategory] = useState("Drawings");
    const [itemHovered, setItemHovered] = useState([-1, -1]);
    const [loadedImages, setLoadedImages] = useState<{
        [url: string]: boolean;
    }>({});
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [message, setMessage] = useState("");

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
        // get an array of only the images that are in the "Drawings" category
        const drawings = images.filter(
            (image) => image.category === "Drawings"
        );
        setJuniColumns(distributeImages(drawings, numColumns));
        const latebis = images.filter(
            (image) => image.category === "Digital Art"
        );
        const pages = images.filter((image) => image.category === "pages");
        setPagesColumns(distributeImages(pages, numColumns));
        setLatebisColumns(distributeImages(latebis, numColumns));
        setAllColumns(distributeImages(images, numColumns));
    }, [numColumns]);

    const distributeImages = (images: ImageItem[], numColumns: number) => {
        const columns: ImageItem[][] = Array.from(
            { length: numColumns },
            () => []
        );
        const columnHeights = Array(numColumns).fill(0); // Tracks cumulative height of each column

        images.forEach((image) => {
            // Find the column with the least height
            const minColumnIndex = columnHeights.indexOf(
                Math.min(...columnHeights)
            );

            // Place the image in that column
            columns[minColumnIndex].push(image);

            // Update the column's height by the aspect ratio increment rather than by resolution height
            columnHeights[minColumnIndex] += image.height / image.width;
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await send({
                name,
                email,
                content: message,
            });
            toast.success("Message sent!");
        } catch (e) {
            console.log("error: ", e);
            toast.error("Message failed to send");
        }
        setLoading(false);
        setName("");
        setEmail("");
        setMessage("");
    };

    return (
        <section className={styles.container}>
            {curCategory === "Contact" && (
                <motion.div
                    initial={{ opacity: 0, y: 100, x: "50%" }}
                    animate={{ opacity: 1, y: 0, x: "-50%" }}
                    transition={{ duration: 0.5 }}
                    exit={{ opacity: 0, y: 100, x: "0" }}
                    className={styles.contactPage}
                >
                    <section className={styles.contactContainer}>
                        <section className={styles.leftSide}>
                            <Image
                                className={styles.leftImage}
                                src={
                                    images.filter(
                                        (image) => image.title === "The Sun"
                                    )[0].src
                                }
                                alt="The Sun"
                                width={
                                    images.filter(
                                        (image) => image.title === "The Sun"
                                    )[0].width
                                }
                                height={
                                    images.filter(
                                        (image) => image.title === "The Sun"
                                    )[0].height
                                }
                            />
                        </section>
                        <section className={styles.contactForm}>
                            <button
                                className={styles.backButton}
                                onClick={() => {
                                    setCurCategory("Drawings");
                                    setItemHovered([-1, -1]);
                                }}
                            >
                                {backArrow} BACK
                            </button>
                            <section className={styles.headingContainer}>
                                <p>CONTACT ME, </p>
                                <Image
                                    src="/logo/logo-small.png"
                                    alt="Logo"
                                    width={900}
                                    height={500}
                                    className={styles.logo}
                                />
                            </section>
                            <section className={styles.formContainer}>
                                <p className={styles.formText}>
                                    If you have any questions, comments, or just
                                    want to say hi, feel free to reach out!
                                </p>
                                <form
                                    className={styles.form}
                                    onSubmit={handleSubmit}
                                >
                                    {loading && <LoadingScreen />}
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Name"
                                        required
                                        value={name}
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                    />
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Email"
                                        required
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                    />
                                    <textarea
                                        name="message"
                                        placeholder="Message"
                                        rows={6}
                                        required
                                        value={message}
                                        onChange={(e) =>
                                            setMessage(e.target.value)
                                        }
                                    ></textarea>
                                    <button type="submit">SEND</button>
                                </form>
                            </section>
                        </section>
                    </section>
                    <section className={styles.contactDetails}>
                        <p>Email: juanaparejaj@gmail.com</p>
                        <p>Instagram: @latebis</p>
                        <Link
                            href="
                            https://www.instagram.com/latebis/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.instagramLink}
                        >
                            {instagramColor}
                        </Link>
                    </section>
                </motion.div>
            )}
            <motion.div
                className={styles.buttonContainer}
                initial={{ opacity: 1, y: 0 }}
                animate={
                    curCategory === "Contact"
                        ? { opacity: 0, y: 30 }
                        : { opacity: 1, y: 0 }
                }
                transition={{ duration: 0.5 }}
            >
                <button
                    className={styles.button1}
                    onClick={() => handleCategory("Drawings")}
                >
                    JUNI
                </button>
                <button
                    className={styles.button2}
                    onClick={() => handleCategory("Digital Art")}
                >
                    LATEBIS
                </button>
                <button
                    className={styles.button3}
                    onClick={() => handleCategory("pages")}
                >
                    PAGES
                </button>
                <button
                    className={styles.button1}
                    onClick={() => handleCategory("Contact")}
                >
                    CONTACT
                </button>
            </motion.div>
            <section className={styles.imageContainer}>
                {curCategory === "Drawings" && 
                <ArtPage category="Drawings" images={juniColumns} numColumns={numColumns} setItemHovered={setItemHovered} itemHovered={itemHovered} loadedImages={loadedImages} handleImageLoad={handleImageLoad}/>}
                {curCategory === "Digital Art" && (
                    <ArtPage category="Digital Art" images={latebisColumns} numColumns={numColumns} setItemHovered={setItemHovered} itemHovered={itemHovered} loadedImages={loadedImages} handleImageLoad={handleImageLoad}/>
                )}
                {curCategory === "pages" && (
                    <ArtPage category="pages" images={pagesColumns} numColumns={numColumns} setItemHovered={setItemHovered} itemHovered={itemHovered} loadedImages={loadedImages} handleImageLoad={handleImageLoad}/>
                )}
                {curCategory === "Contact" && (
                    <section
                        className={`${styles.contactGrid}`}
                        style={{
                            display: "grid",
                            gridTemplateColumns: `repeat(${numColumns}, 1fr)`,
                            gap: "5px",
                        }}
                    >
                        {allColumns.map((column, i) => (
                            <section className={styles.gridColumn} key={i}>
                                {column.map((image, j) => (
                                    <motion.div
                                        key={`image-${i}-${j}`}
                                        initial={{ opacity: 0 }}
                                        whileInView={{ opacity: 1 }}
                                        transition={{ duration: 0 }}
                                        viewport={{
                                            once: true,
                                            amount: 0.1,
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
                                ))}
                            </section>
                        ))}
                    </section>
                )}
            </section>
        </section>
    );
};

export default GridGallery;
