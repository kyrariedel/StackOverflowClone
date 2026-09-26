describe("profile", () => {
    it("opens a user profile from the author name", () => {
        cy.visit("/");
        cy.contains("button.question_author", "elephantCDE").click();
        cy.get("#reputation").should("contain", "reputation");
        cy.contains("Quick question about storage on android");
        cy.contains("Questions");
        cy.contains("Answers");
    });
});
