describe("public homepage smoke", () => {
  it("loads the reference-aligned homepage hero and sections", () => {
    cy.visit("/");

    cy.contains("h1", /Every girl/i).should("exist");
    cy.contains("Youth-led").should("exist");
    cy.contains("a", "Support a girl").should("be.visible");
    cy.contains("a", "Contact us").should("be.visible");
    cy.contains("Born from listening").should("exist");
    cy.contains("Four ways we walk alongside girls").should("exist");
    cy.contains("Advancing rights & dignity").should("exist");
  });
});
