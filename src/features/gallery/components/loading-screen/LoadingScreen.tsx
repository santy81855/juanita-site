import styles from "./LoadingScreen.module.css";
import Spincube from "../loaders/Spincube/Spincube";

const LoadingScreen = () => {
    return (
        <div className={styles.loadingScreen}>
            <div className={styles.loaderContainer}>
                <Spincube size="100px" />
            </div>
        </div>
    );
};

export default LoadingScreen;
