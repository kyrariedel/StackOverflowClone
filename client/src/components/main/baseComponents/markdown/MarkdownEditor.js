import { useEffect, useRef } from "react";
import "../input/index.css";
import "./index.css";
import MarkdownView from "./MarkdownView";
import { insertCodeBlock, prefixLines, wrapSelection } from "../../../../tool/markdown";

const ACTIONS = [
    { label: "Heading", apply: (value, start, end) => prefixLines(value, start, end, "## ") },
    { label: "Bold", apply: (value, start, end) => wrapSelection(value, start, end, "**", "**") },
    { label: "Italic", apply: (value, start, end) => wrapSelection(value, start, end, "*", "*") },
    { label: "Inline code", apply: (value, start, end) => wrapSelection(value, start, end, "`", "`") },
    { label: "Code block", apply: (value, start, end) => insertCodeBlock(value, start, end) },
    { label: "Quote", apply: (value, start, end) => prefixLines(value, start, end, "> ") },
];

const MarkdownEditor = ({
    title,
    mandatory = true,
    hint,
    id,
    val,
    setState,
    err,
    tags,
}) => {
    const field = useRef(null);
    const pendingSelection = useRef(null);

    useEffect(() => {
        if (!pendingSelection.current || !field.current) {
            return;
        }
        const [start, end] = pendingSelection.current;
        pendingSelection.current = null;
        field.current.focus();
        field.current.setSelectionRange(start, end);
    }, [val]);

    const apply = (transform) => {
        const element = field.current;
        const start = element ? element.selectionStart : val.length;
        const end = element ? element.selectionEnd : val.length;
        const result = transform(val || "", start, end);
        pendingSelection.current = [result.selectionStart, result.selectionEnd];
        setState(result.value);
    };

    return (
        <div className="markdown_editor">
            <div className="input_title">
                {title}
                {mandatory ? "*" : ""}
            </div>
            {hint && <div className="input_hint">{hint}</div>}
            <div className="markdown_toolbar" role="toolbar" aria-label="Formatting">
                {ACTIONS.map((action) => (
                    <button
                        key={action.label}
                        type="button"
                        className={`markdown_tool markdown_tool_${action.label.replace(" ", "_").toLowerCase()}`}
                        onClick={() => apply(action.apply)}
                    >
                        {action.label}
                    </button>
                ))}
            </div>
            <textarea
                id={id}
                ref={field}
                className="input_input"
                value={val}
                onChange={(event) => setState(event.target.value)}
            />
            {val && (
                <div className="markdown_preview">
                    <div className="markdown_preview_label">Preview</div>
                    <MarkdownView text={val} tags={tags} />
                </div>
            )}
            {err && <div className="input_error">{err}</div>}
        </div>
    );
};

export default MarkdownEditor;
