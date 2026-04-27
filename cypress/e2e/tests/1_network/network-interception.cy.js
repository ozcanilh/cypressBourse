describe('Network Interception - Validate Requests', () => {
  beforeEach(() => {
    // Clear cookies and storage to ensure consistent network requests
    cy.clearCookies();
    cy.clearLocalStorage();

    cy.then(() => {
      if (Cypress.isBrowser('chromium')) {
        return Cypress.automation('remote:debugger:protocol', {
          command: 'Network.clearBrowserCache',
        });
      }

      return null;
    });
  });

  it('Check intercept JS bundle request during login flow and validate response', () => {
    cy.addContextTest(
      'Test Description',
      'Test Steps: ' +
        '\n1. Setup network interception for JS bundle requests (triggered during login page load)' +
        '\n2. Visit the login page (triggers JS bundle load)' +
        '\n3. Wait for JS bundle request to be triggered' +
        '\n4. Validate response status code is 200' +
        '\n5. Validate basic response structure (content-type header exists)',
    );

    cy.intercept('GET', '**/*.js').as('jsBundle');
    cy.openLoginPage();
    cy.wait('@jsBundle').then((interception) => {
      expect(interception.response.statusCode).to.eq(200);
      expect(interception.response.headers).to.have.property('content-type');
    });
  });

  it('Check intercept product image request during inventory page loading and validate response', () => {
    cy.addContextTest(
      'Test Description',
      'Test Steps: ' +
        '\n1. Setup network interception for product image requests (triggered during product loading)' +
        '\n2. Visit the login page' +
        '\n3. Login with valid credentials (triggers inventory page with product images)' +
        '\n4. Wait for product image request to be triggered' +
        '\n5. Validate response status code is 200' +
        '\n6. Validate basic response structure (content-type header is image)',
    );

    cy.intercept({
      method: 'GET',
      pathname: /\/static\/media\/.+\.(jpg|png)$/,
    }).as('productImage');
    cy.openLoginPage();
    cy.login(Cypress.env('username'), Cypress.env('password'));
    cy.verifyInventoryPageLoaded();

    cy.wait('@productImage', { timeout: 10000 }).then((interception) => {
      expect(interception.response.statusCode).to.eq(200);
      expect(interception.response.headers).to.have.property('content-type');
      expect(interception.response.headers['content-type']).to.include('image');
      expect(interception.request.url).to.match(/\/static\/media\/.+\.(jpg|png)$/);
    });
  });
});
