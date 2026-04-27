describe("API Test - ReqRes Users", () => {
  it("should return users list with status 200", () => {
    cy.request({
      method: "GET",
      url: `${Cypress.env("apiUrl")}/api/users?page=2`,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("data");
      expect(response.body.data).to.be.an("array").and.have.length.greaterThan(0);
      expect(response.body.data[0]).to.have.property("id");
      expect(response.body.data[0]).to.have.property("email");
    });
  });
});
