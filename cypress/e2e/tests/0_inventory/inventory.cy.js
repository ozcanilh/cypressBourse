describe('Inventory Test Cases', () => {
  beforeEach(() => {
    cy.openLoginPage();
    cy.login(Cypress.env('username'), Cypress.env('password'));
  });

  it('Add a product to cart, and verify cart badge', () => {
    cy.addContextTest(
      'Test Description',
      'Test Steps: ' +
        '\n1. Visit the login page' +
        '\n2. Login with valid credentials' +
        '\n3. Verify inventory page is loaded' +
        '\n4. Add first product to cart' +
        '\n5. Verify cart badge shows 1',
    );
    cy.verifyInventoryPageLoaded();
    cy.addFirstProductToCart();
    cy.verifyCartBadge(1);
  });
});
