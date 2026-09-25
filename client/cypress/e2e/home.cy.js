describe("home page", () => {
    it("shows the question board", () => {
        cy.visit("/");
        cy.contains("Fake Stack Overflow");
        cy.get("#searchBar").should("be.visible");
        cy.get("#menu_question").should("contain", "Questions");
        cy.get("#menu_tag").should("contain", "Tags");
        cy.contains("Ask a Question");
    });

    it("opens the tags page from the sidebar", () => {
        cy.visit("/");
        cy.get("#menu_tag").click();
        cy.contains("All Tags");
    });
});
