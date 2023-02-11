/// <reference types="cypress" />

describe('Navigate the sales app ', () => {
  let data;
  before(() => {
    cy.fixture('testdata').then(function (fData) {
      data = fData;
  })
    cy.visit(`https://sales.crowdstreet.com/invexp/properties/all`);
  })

  it('Create an account in market place app', () => {
    const uuid = () => Cypress._.random(0, 1e6);
    const id = uuid();
    const email = `${id}@gmail.com`;
    cy.get('a[data-react-toolbox="button"]').contains("Create An Account").click({ force: true });
    cy.get('input[name="firstName"]').type(data.firstname);
    cy.get('input[name="lastName"]').type(data.lastname);
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type(data.password);
    cy.get('input[name="confirmPassword"]').type(data.password);
    cy.get('#accreditedYes').click();
    cy.get('#hasAgreedTos').click();
    Cypress.Commands.add('confirmCaptcha', function () {
      cy.get('iframe')
        .first()
        .then((recaptchaIframe) => {
          const body = recaptchaIframe.contents()
          cy.wrap(body).find('.recaptcha-checkbox-border').should('be.visible').click()
        })
    })
    cy.get('.leading-4').click();
    cy.wait(30000);
    cy.get('.leading-4').click();
    cy.reload();
    cy.wait(50000);
    cy.get('.leading-4 border-b').click();
    cy.get('.head-link').then(($el) => {
      expect($el).to.include.text(data.firstname)
      });
  })

  it('Complete the profile in my account', () => {
    const p = 'TestImage.JPG';
    cy.wrap('.head-link').invoke('show');
    cy.wrap('.head-link').contains('Profile and Settings').click();
    cy.get('#ssn').type(data.ssn);
    cy.get('button[name="residenceStatus"]').click();
    cy.get('li[role="option"]').contains("I'm a U.S. citizen").click()
    cy.get('button[name="maritalStatus"]').click();
    cy.get('li[role="option"]').contains("Single").click();
    cy.get('button[name="citizenshipCountry"]').click();
    cy.get('li[role="option"]').contains("United States of America")
    .click();
    cy.get('#dob').type(data.dob);
    cy.get('#address').type(data.address);
    cy.get('#city').type(data.city);
    cy.get('button[name="state"]').click();
    cy.get('li[role="option"]').contains("California").click();
    cy.get('button[name="country"]').click();
    cy.get('li[role="option"]').contains("United States of America")
    .click();
    cy.get('#zipCode').type(data.zipCode);
    cy.get('#user-profile-has-regulatory-associations-false').click();

    cy.get('input[type="file"]').attachFile(p);
    cy.get('div[data-testid="id-doc-0-status"]').should
      ('include text','Uploaded');
    cy.get('#user-profile-accredited-false').click();
    const stub = cy.stub()  
    cy.on ('window:alert', stub)
    cy.get('button[data-testid="submit-button"]').click()
      .then(() => {
    expect(stub).to.be.calledWith('Information successfully updated')
    })      
  })  
})
