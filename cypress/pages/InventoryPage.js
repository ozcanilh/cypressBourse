class InventoryPage {
  get inventoryItems() {
    return cy.get('[data-test="inventory-item"]');
  }

  get cartBadge() {
    return cy.get('[data-test="shopping-cart-badge"]');
  }

  get cartLink() {
    return cy.get('[data-test="shopping-cart-link"]');
  }

  addFirstProductToCart() {
    cy.get('[data-test="inventory-item"]')
      .first()
      .find("button[data-test^='add-to-cart']")
      .click();
  }

  verifyCartBadge(count) {
    this.cartBadge.should("have.text", String(count));
  }
}

export default new InventoryPage();
