import { useEffect, useRef } from "react";
import { configure, update } from "jdenticon";
import "./index.css";

configure({
    hues: [29],
    lightness: {
        color: [0.84, 0.84],
        grayscale: [0.84, 0.84],
    },
    saturation: {
        color: 1.0,
        grayscale: 0.81,
    },
    backColor: "#c87c31",
    replaceMode: "never",
});

const Avatar = ({ username, size = 32 }) => {
    const icon = useRef(null);

    useEffect(() => {
        if (icon.current && username) {
            update(icon.current, username);
        }
    }, [username, size]);

    if (!username) {
        return null;
    }

    return (
        <svg
            ref={icon}
            className="avatar"
            width={size}
            height={size}
            data-jdenticon-value={username}
            role="img"
            aria-label={`${username} profile photo`}
        />
    );
};

export default Avatar;
