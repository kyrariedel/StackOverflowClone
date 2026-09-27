import { useState } from "react";
import MarkdownView from "../../src/components/main/baseComponents/markdown/MarkdownView";
import MarkdownEditor from "../../src/components/main/baseComponents/markdown/MarkdownEditor";
import { validateHyperlink } from "../../src/tool";

const sample = [
    "# Heading",
    "",
    "**bold** and *italic* and `code`",
    "",
    "> a quote",
    "",
    "```javascript",
    "**not bold**",
    "console.log(\"hi\");",
    "```",
    "",
    "~~~",
    "print(\"hi\")",
    "~~~",
    "",
    "    indented()",
].join("\n");

describe("markdown formatting", () => {
    it("combines headings, emphasis, quotes, and inline code", () => {
        cy.mount(<MarkdownView text={sample} />);

        cy.get("h1").should("have.text", "Heading");
        cy.get("strong").should("have.text", "bold");
        cy.get("em").should("have.text", "italic");
        cy.get("code.markdown_inline_code").should("have.text", "code");
        cy.get("blockquote").should("contain", "a quote");
    });

    it("combines bold and italic, including inside inline code", () => {
        cy.mount(
            <MarkdownView
                text={"***both*** and **bold *italic* text** and `**bold** *italic*`"}
            />
        );

        cy.get("strong em").first().should("have.text", "both");
        cy.contains("strong", "bold").find("em").should("have.text", "italic");
        cy.get("code.markdown_inline_code strong").should("have.text", "bold");
        cy.get("code.markdown_inline_code em").should("have.text", "italic");
    });

    it("keeps code blocks literal and highlights them", () => {
        cy.mount(<MarkdownView text={sample} tags={[{ name: "python" }]} />);

        cy.get("pre.s-code-block").should("have.length", 3);
        cy.get("pre.s-code-block").eq(0).find("strong").should("not.exist");
        cy.get("pre.s-code-block").eq(0).should("contain", "**not bold**");
        cy.get("pre.s-code-block code").eq(0).should("have.class", "language-javascript");
        cy.get("pre.s-code-block").eq(0).find(".hljs-string").should("exist");
        cy.get("pre.s-code-block code").eq(1).should("have.class", "language-python");
        cy.get("pre.s-code-block").eq(1).find(".hljs-built_in").should("contain", "print");
        cy.get("pre.s-code-block").eq(2).should("contain", "indented()");
        cy.get("pre.s-code-block").eq(2).find("strong").should("not.exist");
    });

    it("uses the question tags when a code fence has no language", () => {
        cy.mount(
            <MarkdownView
                text={"```\nprint('hi')\n```"}
                tags={["python"]}
            />
        );

        cy.get("pre code").should("have.class", "language-python");
    });

    it("does not render stored html", () => {
        cy.mount(<MarkdownView text={'hello <img class="injected" src="x" />'} />);
        cy.contains("hello");
        cy.get("img.injected").should("not.exist");
    });

    it("ignores hyperlinks that sit inside code", () => {
        expect(validateHyperlink("```\n[a](http://bad)\n```")).to.equal(true);
        expect(validateHyperlink("[a](http://bad)")).to.equal(false);
        expect(validateHyperlink("[a](https://example.com)")).to.equal(true);
    });

    it("inserts formatting from the shared editor toolbar", () => {
        function Harness() {
            const [text, setText] = useState("hello");
            return (
                <MarkdownEditor
                    title="Question Text"
                    id="formTextInput"
                    val={text}
                    setState={setText}
                    tags={["javascript"]}
                />
            );
        }

        cy.mount(<Harness />);
        cy.get("#formTextInput").then((element) => {
            element[0].setSelectionRange(0, 5);
        });
        cy.contains("button", "Bold").click();
        cy.get("#formTextInput").should("have.value", "**hello**");
        cy.get(".markdown_preview strong").should("have.text", "hello");

        cy.get("#formTextInput").then((element) => {
            element[0].setSelectionRange(0, element[0].value.length);
        });
        cy.contains("button", "Code block").click();
        cy.get("#formTextInput").should("have.value", "```\n**hello**\n```");
        cy.get(".markdown_preview strong").should("not.exist");
        cy.get(".markdown_preview pre.s-code-block").should("contain", "**hello**");
    });
});
