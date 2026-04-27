const addContext = require('mochawesome/addContext');

/**
 * @memberof cy
 * @method addContextTest
 * @description Add context to mochawesome report
 * @param {String} title - The title of the context
 * @param {String} value - The value/description of the context
 */
Cypress.Commands.add('addContextTest', (title, value) => {
  cy.once('test:after:run', (test) => {
    addContext({ test }, { title, value });
  });
});

/**
 * @memberof cy
 * @method clickIfExists
 * @description Click element if it exists in the DOM
 * @param {String} selector - The CSS selector of the element to click
 */
Cypress.Commands.add('clickIfExists', (selector) => {
  cy.get('body').then(($body) => {
    if ($body.find(selector).length > 0) {
      cy.get(selector).click();
    }
  });
});

/**
 * @memberof cy
 * @method verifyVisible
 * @description Verify element is visible
 * @param {String} selector - The CSS selector of the element to verify
 */
Cypress.Commands.add('verifyVisible', (selector) => {
  cy.get(selector).should('be.visible');
});
