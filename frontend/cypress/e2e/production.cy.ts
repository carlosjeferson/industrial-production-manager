describe('Industrial Production Flow', () => {
  Cypress.on('uncaught:exception', () => false);

  beforeEach(() => {
    cy.visit('http://localhost:5173');
    cy.wait(2000); 
  });

  it('should complete the full industrial cycle (RF007 & RF008)', () => {
    const materialCode = 'MAT-' + Date.now(); 
    const materialName = 'Iron Plate';
    const productName = 'Industrial Engine';

    cy.get('input[placeholder="MAT-001"]').type(materialCode);
    cy.get('input[placeholder="e.g. Iron Plate"]').type(materialName);
    cy.get('input[type="number"]').first().clear().type('100');
    cy.get('button').contains(/Register Material/i).click();

    cy.contains(materialCode, { timeout: 10000 }).should('be.visible');

    cy.get('input[placeholder="e.g. PRD-001"]').type('ENG-100');
    cy.get('input[placeholder="e.g. Luxury Sofa"]').type(productName);
    cy.get('input[placeholder="0.00"]').type('15000');
    
    cy.get('select').select(materialName);
    
    cy.get('input[type="number"]').last().clear().type('2');
    
    cy.get('button').contains(/Register Product/i).click();

    cy.contains(productName, { timeout: 12000 }).should('be.visible');

    cy.contains('Production Strategy', { timeout: 10000 }).should('be.visible');
    
    cy.contains('h3', productName).should('be.visible');

    cy.contains('3xl', '50').should('not.exist');
    cy.contains(productName).parents().contains('50').should('be.visible');
    
    cy.contains('Materials to be Consumed').should('be.visible');
    cy.contains(materialName).should('be.visible');
  });

  it('should be able to delete a product', () => {
    cy.get('button[title="Delete"]').first().click();

    cy.get('.swal2-popup').should('be.visible');
    cy.get('.swal2-confirm').click();

    cy.contains('removido', { timeout: 10000 }).should('be.visible');
  });
});