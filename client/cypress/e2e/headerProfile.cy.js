describe("header profile", () => {
    it("shows the photo and reputation beside search and opens the profile", () => {
        cy.visit("/");
        cy.get("#sideBarNav").should("not.contain", "Welcome");
        cy.get("#sideBarNav").should("have.css", "border-right-style", "solid");
        cy.get("#sideBarNav").should("have.css", "border-right-color", "rgb(228, 228, 228)");
        cy.get(".question").first().should("have.css", "border-top-style", "solid");
        cy.get(".question").first().should("have.css", "border-top-color", "rgb(228, 228, 228)");
        cy.get("#logoutbtn").should("not.exist");
        cy.get("#searchBar").then(($search) => {
            const searchRight = $search[0].getBoundingClientRect().right;
            cy.get("#signupbtn").then(($signup) => {
                expect($signup[0].getBoundingClientRect().left).to.be.greaterThan(searchRight - 1);
            });
            cy.get("#loginbtn").then(($login) => {
                expect($login[0].getBoundingClientRect().left).to.be.greaterThan(searchRight - 1);
            });
        });
        cy.get("#loginbtn").click();
        cy.get("#formAccountUsernameInput").type("kyra123");
        cy.get("#formAccountPasswordInput").type("123");
        cy.get(".form_postBtn").click();

        cy.get("#signupbtn").should("not.exist");
        cy.get("#loginbtn").should("not.exist");
        cy.get("#logoutbtn").should("be.visible");
        cy.get("#header_profile")
            .should("be.visible")
            .and("have.css", "background-color", "rgba(0, 0, 0, 0)")
            .and("have.css", "border-top-style", "none");
        cy.get("#header_profile .avatar").should("exist");
        cy.get("#header_profile span").invoke("text").should("match", /^-?\d+(\.\d)?k?$/);
        cy.get("#searchBar").then(($search) => {
            cy.get("#header_profile").then(($button) => {
                expect($button[0].getBoundingClientRect().left).to.be.greaterThan(
                    $search[0].getBoundingClientRect().right - 1
                );
                cy.get("#logoutbtn").then(($logout) => {
                    expect($logout[0].getBoundingClientRect().left).to.be.greaterThan(
                        $button[0].getBoundingClientRect().right - 1
                    );
                });
            });
        });

        cy.get("#header_profile").click();
        cy.get("#reputation").should("contain", "reputation");
        cy.contains("kyra123");
    });
});
