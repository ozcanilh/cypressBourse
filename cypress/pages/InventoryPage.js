class InventoryPage {
  constructor() {
    this.elements = {
      inventoryItem: '[data-test="inventory-item"]',
      cartBadge: '[data-test="shopping-cart-badge"]',
      addToCartButton: "button[data-test^='add-to-cart']",
    };
  }

  getInventoryItems() {
    return this.elements.inventoryItem;
  }

  getCartBadge() {
    return this.elements.cartBadge;
  }

  getAddToCartButton() {
    return this.elements.addToCartButton;
  }
}

export default new InventoryPage();
