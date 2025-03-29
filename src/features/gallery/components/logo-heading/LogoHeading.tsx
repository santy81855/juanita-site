import styles from "./style.module.css";
import Image from "next/image";

const LogoHeading = () => {
    return (
        <div className={styles.container}>
            <Image
                className={styles.image}
                src="/logo/logo.png"
                alt="logo"
                width={200}
                height={100}
                priority
            />
        </div>
    );
};

export default LogoHeading;
