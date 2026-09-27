import { useEffect, useRef } from "react";
import hljs from "highlight.js";
import "highlight.js/styles/stackoverflow-light.css";
import { parseMarkdown, tagNames } from "../../../../tool/markdown";
import "./index.css";

const resolveLanguage = (hint, tags) => {
    const candidates = [];
    if (hint) {
        candidates.push(hint);
    }
    candidates.push(...tagNames(tags));
    for (const name of candidates) {
        const key = String(name).trim().toLowerCase();
        if (key && hljs.getLanguage(key)) {
            return key;
        }
    }
    return "";
};

const CodeBlock = ({ value, language, tags }) => {
    const ref = useRef(null);
    const chosen = resolveLanguage(language, tags);

    useEffect(() => {
        const element = ref.current;
        if (!element) {
            return;
        }
        element.textContent = value;
        element.className = chosen ? `hljs language-${chosen}` : "hljs";
        delete element.dataset.highlighted;
        hljs.highlightElement(element);
    }, [value, chosen]);

    return (
        <pre className="s-code-block">
            <code ref={ref} className={chosen ? `hljs language-${chosen}` : "hljs"}>
                {value}
            </code>
        </pre>
    );
};

const Inline = ({ nodes }) =>
    (nodes || []).map((node, index) => {
        if (node.type === "text") {
            return node.value;
        }
        if (node.type === "bold") {
            return (
                <strong key={index}>
                    <Inline nodes={node.children} />
                </strong>
            );
        }
        if (node.type === "italic") {
            return (
                <em key={index}>
                    <Inline nodes={node.children} />
                </em>
            );
        }
        if (node.type === "both") {
            return (
                <strong key={index}>
                    <em>
                        <Inline nodes={node.children} />
                    </em>
                </strong>
            );
        }
        if (node.type === "code") {
            return (
                <code key={index} className="markdown_inline_code">
                    <Inline nodes={node.children} />
                </code>
            );
        }
        if (node.type === "link") {
            return (
                <a key={index} href={node.href} target="_blank" rel="noopener noreferrer">
                    <Inline nodes={node.children} />
                </a>
            );
        }
        return null;
    });

const MarkdownView = ({ text, tags }) => {
    const blocks = parseMarkdown(text);
    return (
        <div className="markdown">
            {blocks.map((block, index) => {
                if (block.type === "code") {
                    return (
                        <CodeBlock
                            key={index}
                            value={block.value}
                            language={block.language}
                            tags={tags}
                        />
                    );
                }
                if (block.type === "heading") {
                    const Heading = `h${block.level}`;
                    return (
                        <Heading key={index} className="markdown_heading">
                            <Inline nodes={block.inlines} />
                        </Heading>
                    );
                }
                if (block.type === "quote") {
                    return (
                        <blockquote key={index} className="markdown_quote">
                            <Inline nodes={block.inlines} />
                        </blockquote>
                    );
                }
                return (
                    <p key={index}>
                        <Inline nodes={block.inlines} />
                    </p>
                );
            })}
        </div>
    );
};

export default MarkdownView;
