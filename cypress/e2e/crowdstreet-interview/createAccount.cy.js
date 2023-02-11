/// <reference types="cypress" />

describe('Navigate the sales app ', () => {
  before(() => {
    cy.fixture('testdata').then(function (testdata) {
      this.testdata = testdata
  })
    cy.visit(`https://sales.crowdstreet.com/invexp/properties/all`);
  })

  it('Create an account in market place app', () => {
    const uuid = () => Cypress._.random(0, 1e6);
    const id = uuid();
    const email = `${id}@gmail.com`;
    cy.get('a:contains("Create An Account")').click();
    cy.get('input[name="firstName"]').type(this.testdata.firstname);
    cy.get('input[name="lastName"]').type(this.testdata.lastname);
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type(this.testdata.password);
    cy.get('input[name="confirmPassword"]').type(this.testdata.password);
    cy.get('#accreditedYes').click();
    cy.get('#hasAgreedTos').click();
    cy.get('.recaptcha-checkbox-border').click();
    cy.get('.leading-4').click();
    cy.reload();
    cy.get('.leading-4 border-b').click();
    cy.get('.head-link').should.contains(this.testdata.firstname);
  })

  it('Complete the profile in my account', () => {
    const p = 'TestImage.JPG';
    cy.wrap('.head-link').invoke('show');
    cy.wrap('.head-link').contains('Profile and Settings').click();
    cy.get('#ssn').type(this.testdata.firstname.ssn);
    cy.get('button[name="residenceStatus"]').click();
    cy.get('li[role="option"]').contains("I'm a U.S. citizen").click()
    cy.get('button[name="maritalStatus"]').click();
    cy.get('li[role="option"]').contains("Single").click();
    cy.get('button[name="citizenshipCountry"]').click();
    cy.get('li[role="option"]').contains("United States of America")
    .click();
    cy.get('#dob').type(this.testdata.dob);
    cy.get('#address').type(this.testdata.address);
    cy.get('#city').type(this.testdata.city);
    cy.get('button[name="state"]').click();
    cy.get('li[role="option"]').contains("California").click();
    cy.get('button[name="country"]').click();
    cy.get('li[role="option"]').contains("United States of America")
    .click();
    cy.get('#zipCode').type(this.testdata.zipCode);
    cy.get('#user-profile-has-regulatory-associations-false').click();

    cy.get('input[type="file"]').attachFile(p);
    cy.get('div[data-testid="id-doc-0-status"]').should
    .contains("Uploaded");
    cy.get('#user-profile-accredited-false').click();
    const stub = cy.stub()  
    cy.on ('window:alert', stub)
    cy.get('button[data-testid="submit-button"]').click()
      .then(() => {
    expect(stub).to.be.calledWith('Information successfully updated')
    })      
  })  
})
