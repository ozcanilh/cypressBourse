import LoginPage from "../pages/LoginPage";
import InventoryPage from "../pages/InventoryPage";

describe("UI Flow - Login & Add to Cart", () => {
  beforeEach(() => {
    LoginPage.visit();
  });

  it("should login, add a product to cart, and verify cart badge", () => {
    LoginPage.login(Cypress.env("username"), Cypress.env("password"));

    cy.url().should("include", "/inventory.html");

    InventoryPage.inventoryItems.should("have.length.greaterThan", 0);

    InventoryPage.addFirstProductToCart();

    InventoryPage.verifyCartBadge(1);
  });
});
