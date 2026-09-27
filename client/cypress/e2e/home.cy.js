describe("home page", () => {
    it("shows the question board", () => {
        cy.visit("/");
        cy.contains("Stack Overflow");
        cy.get("#searchBar").should("be.visible");
        cy.get("#menu_question").should("contain", "Questions");
        cy.get("#menu_tag").should("contain", "Tags");
        cy.contains("Ask a Question");
    });

    it("keeps the page in a centered column on a wide window", () => {
        cy.viewport(1600, 900);
        cy.visit("/");
        cy.get(".app_shell").then(($shell) => {
            const rect = $shell[0].getBoundingClientRect();
            expect(rect.width).to.equal(1264);
            expect(rect.left).to.be.closeTo((1600 - 1264) / 2, 1);
        });
    });

    it("opens the tags page from the sidebar", () => {
        cy.visit("/");
        cy.get("#menu_tag").click();
        cy.contains("All Tags");
    });
});
