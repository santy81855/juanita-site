import "./style.css";

type SpincubeProps = {
    size?: string;
};

const Spincube = ({ size }: SpincubeProps) => {
    const style = size ? { width: size, height: size } : {};
    return (
        <div className="sk-folding-cube" style={style}>
            <div className="sk-cube1 sk-cube" />
            <div className="sk-cube2 sk-cube" />
            <div className="sk-cube4 sk-cube" />
            <div className="sk-cube3 sk-cube" />
        </div>
    );
};

export default Spincube;
