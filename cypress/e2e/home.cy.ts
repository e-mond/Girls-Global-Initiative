describe("public homepage smoke", () => {
  it("loads the Foundations homepage shell", () => {
    cy.visit("/");
    cy.contains("h1", /Every girl/i).should("be.visible");
    cy.contains("a", "Support a girl").should("be.visible");
  });
});
