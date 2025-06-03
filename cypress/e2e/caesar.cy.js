describe('Caesar Cypher Component', () => {
  beforeEach(() => {
    // Visite la page avant chaque test
    cy.visit('pages/caesar.html');
  });

  it('Étape 1 : Automatiser la complétion du formulaire', () => {
    // Vérifie que les éléments du formulaire existent
    cy.dataCy('cypherKey').should('exist');
    cy.dataCy('inputText').should('exist');
    cy.dataCy('cypherBtn').should('exist');
    
    // Complète le formulaire
    cy.get('#cypherKey').clear().type('6');
    cy.get('#inputText').clear().type('Hello World!');
    
    // Vérifie que les valeurs ont été saisies
    cy.get('#cypherKey').should('have.value', '6');
    cy.get('#inputText').should('have.value', 'Hello World!');
  });

  it('Étape 2 : Automatiser la validation du formulaire', () => {
    // Complète le formulaire
    cy.get('#cypherKey').clear().type('6');
    cy.get('#inputText').clear().type('Hello World!');
    
    // Clique sur le bouton pour valider
    cy.get('#cypherBtn').click();
    
    // Vérifie que le résultat apparaît
    cy.get('#result').should('exist');
    cy.get('#result').should('not.be.empty');
  });

  it('Étape 3 : Vérifier l\'affichage du bon résultat', () => {
    // Complète le formulaire avec les valeurs test
    cy.get('#cypherKey').clear().type('6');
    cy.get('#inputText').clear().type('Hello World!');
    
    // Valide le formulaire
    cy.get('#cypherBtn').click();
    
    // Vérifie que le résultat est correct
    cy.get('#result').should('contain', 'Nkrru Cuxrj!');
    cy.get('#result').should('have.css', 'color', 'rgb(40, 167, 69)'); // Vérifie la couleur verte
  });

  it('Test complet des 3 étapes en séquence', () => {
    // Étape 1 : Complétion du formulaire
    cy.get('#cypherKey').clear().type('6');
    cy.get('#inputText').clear().type('Hello World!');
    
    // Étape 2 : Validation du formulaire
    cy.get('#cypherBtn').click();
    
    // Étape 3 : Vérification du résultat
    cy.get('#result').should('contain', 'Nkrru Cuxrj!');
  });

  it('Test avec différentes valeurs', () => {
    // Test avec une clé différente
    cy.get('#cypherKey').clear().type('1');
    cy.get('#inputText').clear().type('abc');
    cy.get('#cypherBtn').click();
    cy.get('#result').should('contain', 'bcd');
    
    // Test avec une autre valeur
    cy.get('#cypherKey').clear().type('3');
    cy.get('#inputText').clear().type('xyz');
    cy.get('#cypherBtn').click();
    cy.get('#result').should('contain', 'abc');
  });
});
