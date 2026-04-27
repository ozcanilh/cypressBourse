describe('API Test - ReqRes Users', () => {
  it('GET /api/users?page=2 - Check status and data array with at least one user', () => {
    cy.addContextTest(
      'Test Description',
      'Test Steps: ' +
        '\n1. Send GET request to /api/users?page=2' +
        '\n2. Validate status code is 200' +
        '\n3. Validate response contains data array with at least one user' +
        '\n4. Validate first user has id and email properties',
    );

    cy.apiGet(`${Cypress.env('apiUrl')}/api/users?page=2`, {
      'x-api-key': Cypress.env('reqresApiKey'),
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('data');
      expect(response.body.data).to.be.an('array').and.have.length.greaterThan(0);
      expect(response.body.data[0]).to.have.property('id');
      expect(response.body.data[0]).to.have.property('email');
    });
  });
});
