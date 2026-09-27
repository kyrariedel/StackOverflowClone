import { hasInvalidHyperlink } from "./markdown";

const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "June",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
];

const getMetaData = (date) => {
    const now = new Date();
    const diffs = Math.floor(Math.abs(now - date) / 1000);

    if (diffs < 60) {
        return diffs + " seconds ago";
    } else if (diffs < 60 * 60) {
        return Math.floor(diffs / 60) + " minutes ago";
    } else if (diffs < 60 * 60 * 24) {
        let h = Math.floor(diffs / 3600);
        return h + " hours ago";
    } else if (diffs < 60 * 60 * 24 * 365) {
        return (
            months[date.getMonth()] +
            " " +
            getDateHelper(date) +
            " at " +
            date.toTimeString().slice(0, 8)
        );
    } else {
        return (
            months[date.getMonth()] +
            " " +
            getDateHelper(date) +
            ", " +
            date.getFullYear() +
            " at " +
            date.toTimeString().slice(0, 8)
        );
    }
};

const getDateHelper = (date) => {
    let day = date.getDate();
    if (day < 10) {
        day = "0" + day;
    }
    return day;
};

const validateHyperlink = (text) => !hasInvalidHyperlink(text);

const handleHyperlink = (text = "") => {
    const source = text == null ? "" : String(text);
    const pattern = /\[([^\]]*)\]\(([^)]*)\)/g;
    const nodes = [];
    let lastIndex = 0;

    for (const match of source.matchAll(pattern)) {
        if (match.index > lastIndex) {
            nodes.push(source.slice(lastIndex, match.index));
        }

        const label = match[1];
        const href = match[2];
        const isSafeLink =
            label.length > 0 &&
            href.startsWith("https://") &&
            href.length > "https://".length;

        if (isSafeLink) {
            nodes.push(
                <a
                    key={match.index}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {label}
                </a>
            );
        } else {
            nodes.push(match[0]);
        }

        lastIndex = match.index + match[0].length;
    }

    if (lastIndex < source.length) {
        nodes.push(source.slice(lastIndex));
    }

    return <div>{nodes}</div>;
};

export { getMetaData, handleHyperlink, validateHyperlink };
