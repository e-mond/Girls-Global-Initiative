describe("public homepage smoke", () => {
  it("loads the reference-aligned homepage hero", () => {
    cy.visit("/");
    cy.contains("h1", /Every girl/i).should("be.visible");
    cy.contains("Youth-led").should("be.visible");
    cy.contains("a", "Support a girl").should("be.visible");
    cy.contains("a", "Contact us").should("be.visible");
    cy.contains("Advancing rights & dignity").should("be.visible");
  });
});
