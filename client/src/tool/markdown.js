const openingFence = (line) => {
    const match = /^( {0,3})(`{3,}|~{3,})(.*)$/.exec(line);
    if (!match) {
        return null;
    }
    const marker = match[2][0];
    if (match[3].includes(marker)) {
        return null;
    }
    return {
        marker,
        size: match[2].length,
        info: match[3].trim().split(/\s+/)[0] || "",
    };
};

const closingFence = (line, marker, size) => {
    const match = /^( {0,3})([`~]+)\s*$/.exec(line);
    return Boolean(match && match[2][0] === marker && match[2].length >= size);
};

const isIndented = (line) => /^(?: {4}|\t)/.test(line);

const startsNewBlock = (line) =>
    Boolean(openingFence(line)) ||
    /^(#{1,6})(?:\s+\S)/.test(line) ||
    /^>/.test(line);

const findCode = (source, from) => {
    const start = source.indexOf("`", from);
    if (start < 0) {
        return null;
    }
    const end = source.indexOf("`", start + 1);
    if (end < 0) {
        return null;
    }
    return {
        kind: "code",
        index: start,
        end: end + 1,
        value: source.slice(start + 1, end),
    };
};

const findWrap = (source, from, marker, kind) => {
    const start = source.indexOf(marker, from);
    if (start < 0) {
        return null;
    }
    const end = source.indexOf(marker, start + marker.length);
    if (end < 0) {
        return null;
    }
    return {
        kind,
        index: start,
        end: end + marker.length,
        value: source.slice(start + marker.length, end),
    };
};

const isWord = (char) => Boolean(char && /[\w]/.test(char));

const findUnderscoreItalic = (source, from) => {
    let search = from;
    while (search < source.length) {
        const start = source.indexOf("_", search);
        if (start < 0) {
            return null;
        }
        if (source[start + 1] === "_" || isWord(source[start - 1])) {
            search = start + 1;
            continue;
        }
        let closeAt = start + 1;
        while (closeAt < source.length) {
            const end = source.indexOf("_", closeAt);
            if (end < 0) {
                return null;
            }
            if (source[end + 1] === "_" || isWord(source[end + 1])) {
                closeAt = end + 1;
                continue;
            }
            return {
                kind: "italic",
                index: start,
                end: end + 1,
                value: source.slice(start + 1, end),
            };
        }
        return null;
    }
    return null;
};

const findItalic = (source, from) => {
    let search = from;
    while (search < source.length) {
        const start = source.indexOf("*", search);
        if (start < 0) {
            return null;
        }
        if (source[start - 1] === "*" || source[start + 1] === "*") {
            search = start + 1;
            continue;
        }
        let closeAt = start + 1;
        while (closeAt < source.length) {
            const end = source.indexOf("*", closeAt);
            if (end < 0) {
                return null;
            }
            if (source[end - 1] === "*" || source[end + 1] === "*") {
                closeAt = end + 1;
                continue;
            }
            return {
                kind: "italic",
                index: start,
                end: end + 1,
                value: source.slice(start + 1, end),
            };
        }
        return null;
    }
    return null;
};

const findLink = (source, from) => {
    const pattern = /\[([^\]]+)\]\((https:\/\/[^)\s]+)\)/g;
    pattern.lastIndex = from;
    const match = pattern.exec(source);
    if (!match || match[2].length <= "https://".length) {
        return null;
    }
    return {
        kind: "link",
        index: match.index,
        end: match.index + match[0].length,
        value: match[1],
        href: match[2],
    };
};

const nextMarker = (source, from, emphasisOnly) => {
    const found = [
        emphasisOnly ? null : findCode(source, from),
        findWrap(source, from, "***", "both"),
        findWrap(source, from, "___", "both"),
        findWrap(source, from, "**", "bold"),
        findWrap(source, from, "__", "bold"),
        findItalic(source, from),
        findUnderscoreItalic(source, from),
        emphasisOnly ? null : findLink(source, from),
    ].filter(Boolean);
    found.sort((a, b) => a.index - b.index);
    return found[0] || null;
};

const parseInlines = (source, emphasisOnly = false) => {
    const nodes = [];
    let index = 0;
    while (index < source.length) {
        const marker = nextMarker(source, index, emphasisOnly);
        if (!marker) {
            nodes.push({ type: "text", value: source.slice(index) });
            break;
        }
        if (marker.index > index) {
            nodes.push({ type: "text", value: source.slice(index, marker.index) });
        }
        if (marker.kind === "code") {
            nodes.push({
                type: "code",
                children: parseInlines(marker.value, true),
            });
        } else if (marker.kind === "link") {
            nodes.push({
                type: "link",
                href: marker.href,
                children: parseInlines(marker.value),
            });
        } else {
            nodes.push({
                type: marker.kind,
                children: parseInlines(marker.value, emphasisOnly),
            });
        }
        index = marker.end;
    }
    return nodes;
};

const parseMarkdown = (source) => {
    const lines = (source == null ? "" : String(source)).replace(/\r\n/g, "\n").split("\n");
    const blocks = [];
    let index = 0;

    while (index < lines.length) {
        const line = lines[index];
        if (line.trim() === "") {
            index += 1;
            continue;
        }

        const fence = openingFence(line);
        if (fence) {
            const body = [];
            index += 1;
            while (index < lines.length && !closingFence(lines[index], fence.marker, fence.size)) {
                body.push(lines[index]);
                index += 1;
            }
            if (index < lines.length) {
                index += 1;
            }
            blocks.push({ type: "code", language: fence.info, value: body.join("\n") });
            continue;
        }

        if (isIndented(line)) {
            const body = [];
            while (index < lines.length) {
                if (lines[index].trim() === "") {
                    let look = index + 1;
                    while (look < lines.length && lines[look].trim() === "") {
                        look += 1;
                    }
                    if (look < lines.length && isIndented(lines[look])) {
                        body.push("");
                        index += 1;
                        continue;
                    }
                    break;
                }
                if (!isIndented(lines[index])) {
                    break;
                }
                body.push(lines[index].replace(/^(?: {4}|\t)/, ""));
                index += 1;
            }
            blocks.push({ type: "code", language: "", value: body.join("\n") });
            continue;
        }

        const heading = /^(#{1,6})\s+(\S.*)$/.exec(line);
        if (heading) {
            blocks.push({
                type: "heading",
                level: heading[1].length,
                inlines: parseInlines(heading[2].trim()),
            });
            index += 1;
            continue;
        }

        if (/^>/.test(line)) {
            const quoted = [];
            while (index < lines.length && /^>/.test(lines[index])) {
                quoted.push(lines[index].replace(/^>\s?/, ""));
                index += 1;
            }
            blocks.push({ type: "quote", inlines: parseInlines(quoted.join("\n")) });
            continue;
        }

        const paragraph = [line];
        index += 1;
        while (index < lines.length && lines[index].trim() !== "" && !startsNewBlock(lines[index])) {
            paragraph.push(lines[index]);
            index += 1;
        }
        blocks.push({ type: "paragraph", inlines: parseInlines(paragraph.join(" ")) });
    }

    return blocks;
};

const plainText = (nodes) =>
    (nodes || [])
        .map((node) => {
            if (node.type === "code") {
                return "";
            }
            if (node.type === "text") {
                return node.value;
            }
            if (node.children) {
                return plainText(node.children);
            }
            return "";
        })
        .join("");

const hasInvalidHyperlink = (source) => {
    const pattern = /\[([^\]]*)\]\(([^)]*)\)/g;
    const chunks = parseMarkdown(source).map((block) => {
        if (block.type === "code") {
            return "";
        }
        return plainText(block.inlines);
    });

    for (const chunk of chunks) {
        for (const match of chunk.matchAll(pattern)) {
            const label = match[1];
            const href = match[2];
            if (!label.length || !href.startsWith("https://") || href.length <= "https://".length) {
                return true;
            }
        }
    }
    return false;
};

const tagNames = (tags) => {
    const list = Array.isArray(tags) ? tags : String(tags || "").split(/\s+/);
    return list
        .map((tag) => (typeof tag === "string" ? tag : tag && tag.name))
        .map((name) => (name || "").trim())
        .filter(Boolean);
};

const wrapSelection = (value, start, end, before, after) => {
    const selected = value.slice(start, end);
    const next = value.slice(0, start) + before + selected + after + value.slice(end);
    const selectionStart = start + before.length;
    return {
        value: next,
        selectionStart,
        selectionEnd: selectionStart + selected.length,
    };
};

const prefixLines = (value, start, end, prefix) => {
    const lineStart = value.lastIndexOf("\n", Math.max(0, start - 1)) + 1;
    const lineEndIndex = value.indexOf("\n", end);
    const lineEnd = lineEndIndex === -1 ? value.length : lineEndIndex;
    const block = value.slice(lineStart, lineEnd);
    const nextBlock = block.split("\n").map((line) => prefix + line).join("\n");
    return {
        value: value.slice(0, lineStart) + nextBlock + value.slice(lineEnd),
        selectionStart: lineStart,
        selectionEnd: lineStart + nextBlock.length,
    };
};

const insertCodeBlock = (value, start, end) =>
    wrapSelection(value, start, end, "```\n", "\n```");

export {
    parseMarkdown,
    hasInvalidHyperlink,
    tagNames,
    wrapSelection,
    prefixLines,
    insertCodeBlock,
};
