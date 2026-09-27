describe("markdown posts", () => {
    it("creates a question with shared formatting and shows the highlighted post", () => {
        const title = `Markdown check ${Date.now()}`;
        const text = [
            "# Heading",
            "",
            "**bold** and *italic* and `code`",
            "",
            "> a quote",
            "",
            "```",
            "**not bold**",
            "console.log(\"hi\");",
            "```",
        ].join("\n");

        cy.visit("/");
        cy.get("#loginbtn").click();
        cy.get("#formAccountUsernameInput").type("kyra123");
        cy.get("#formAccountPasswordInput").type("123");
        cy.get(".form_postBtn").click();
        cy.contains("button", "Ask a Question").click();
        cy.contains("button", "Heading").should("be.visible");
        cy.contains("button", "Code block").should("be.visible");
        cy.get("#formTitleInput").type(title);
        cy.get("#formTextInput").then(($element) => {
            const element = $element[0];
            const setter = Object.getOwnPropertyDescriptor(
                window.HTMLTextAreaElement.prototype,
                "value"
            ).set;
            setter.call(element, text);
            element.dispatchEvent(new Event("input", { bubbles: true }));
            element.dispatchEvent(new Event("change", { bubbles: true }));
        });
        cy.get("#formTagInput").type("javascript");
        cy.get(".markdown_preview h1").should("have.text", "Heading");
        cy.get(".markdown_preview strong").should("have.text", "bold");
        cy.get(".markdown_preview pre.s-code-block").should("contain", "**not bold**");
        cy.get(".markdown_preview pre.s-code-block strong").should("not.exist");
        cy.get(".markdown_preview pre code").should("have.class", "language-javascript");
        cy.contains("button", "Post Question").click();
        cy.contains(".postTitle", title).click();
        cy.get(".answer_question_text h1").should("have.text", "Heading");
        cy.get(".answer_question_text strong").should("have.text", "bold");
        cy.get(".answer_question_text em").should("have.text", "italic");
        cy.get(".answer_question_text blockquote").should("contain", "a quote");
        cy.get(".answer_question_text pre.s-code-block").should("contain", "**not bold**");
        cy.get(".answer_question_text pre.s-code-block strong").should("not.exist");
        cy.get(".answer_question_text pre code.language-javascript .hljs-string").should("exist");
    });
});
