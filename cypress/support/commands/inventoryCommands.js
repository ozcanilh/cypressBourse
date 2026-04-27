import inventoryPage from '../../pages/inventoryPage';

/**
 * @memberof cy
 * @method addFirstProductToCart
 * @description Add the first product to cart
 */
Cypress.Commands.add('addFirstProductToCart', () => {
  cy.get(inventoryPage.getInventoryItems())
    .first()
    .find(inventoryPage.getAddToCartButton())
    .click();
});

/**
 * @memberof cy
 * @method verifyCartBadge
 * @description Verify cart badge shows the expected count
 * @param {Number} count - The expected number to be shown on the cart badge
 */
Cypress.Commands.add('verifyCartBadge', (count) => {
  cy.get(inventoryPage.getCartBadge()).should('have.text', String(count));
});

/**
 * @memberof cy
 * @method verifyInventoryPageLoaded
 * @description Verify inventory page is loaded
 */
Cypress.Commands.add('verifyInventoryPageLoaded', () => {
  cy.url().should('include', '/inventory.html');
  cy.get(inventoryPage.getInventoryItems()).should('have.length.greaterThan', 0);
});
