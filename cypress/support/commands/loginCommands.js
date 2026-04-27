import loginPage from '../../pages/loginPage';

/**
 * @memberof cy
 * @method login
 * @description Login with username and password
 * @param {String} username - The username to login with
 * @param {String} password - The password to login with
 */
Cypress.Commands.add('login', (username, password) => {
  cy.get(loginPage.getUsernameInput()).type(username);
  cy.get(loginPage.getPasswordInput()).type(password);
  cy.get(loginPage.getLoginButton()).click();
});

/**
 * @memberof cy
 * @method openLoginPage
 * @description Open the login page
 */
Cypress.Commands.add('openLoginPage', () => {
  cy.visit('/');
});

/**
 * @memberof cy
 * @method verifyLoginPageLoaded
 * @description Verify login page is loaded
 */
Cypress.Commands.add('verifyLoginPageLoaded', () => {
  cy.get(loginPage.getUsernameInput()).should('be.visible');
  cy.get(loginPage.getPasswordInput()).should('be.visible');
  cy.get(loginPage.getLoginButton()).should('be.visible');
});
