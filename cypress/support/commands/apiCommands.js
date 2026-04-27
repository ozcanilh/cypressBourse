/**
 * @memberof cy
 * @method apiGet
 * @description Send a GET request
 * @param {String} url - The URL to send the request to
 * @param {Object} headers - Optional request headers
 */
Cypress.Commands.add('apiGet', (url, headers = {}) => {
  return cy.request({
    method: 'GET',
    url,
    headers,
    failOnStatusCode: false,
  });
});

/**
 * @memberof cy
 * @method apiPost
 * @description Send a POST request
 * @param {String} url - The URL to send the request to
 * @param {Object} body - The request body
 * @param {Object} headers - Optional request headers
 */
Cypress.Commands.add('apiPost', (url, body, headers = {}) => {
  return cy.request({
    method: 'POST',
    url,
    body,
    headers,
    failOnStatusCode: false,
  });
});

/**
 * @memberof cy
 * @method apiPut
 * @description Send a PUT request
 * @param {String} url - The URL to send the request to
 * @param {Object} body - The request body
 * @param {Object} headers - Optional request headers
 */
Cypress.Commands.add('apiPut', (url, body, headers = {}) => {
  return cy.request({
    method: 'PUT',
    url,
    body,
    headers,
    failOnStatusCode: false,
  });
});

/**
 * @memberof cy
 * @method apiDelete
 * @description Send a DELETE request
 * @param {String} url - The URL to send the request to
 * @param {Object} headers - Optional request headers
 */
Cypress.Commands.add('apiDelete', (url, headers = {}) => {
  return cy.request({
    method: 'DELETE',
    url,
    headers,
    failOnStatusCode: false,
  });
});
