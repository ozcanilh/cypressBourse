describe("Network Interception - Validate Requests", () => {
  it("should intercept inventory page load and validate response", () => {
    cy.intercept("GET", "/inventory.html").as("inventoryPage");

    cy.visit("/");
    cy.get('[data-test="username"]').type(Cypress.env("username"));
    cy.get('[data-test="password"]').type(Cypress.env("password"));
    cy.get('[data-test="login-button"]').click();

    cy.wait("@inventoryPage").then((interception) => {
      expect(interception.response.statusCode).to.eq(200);
      expect(interception.response.body).to.include("inventory_container");
    });
  });
});
