describe('Lightbox Tests', () => {
  beforeEach(() => {
    // Visiter la page lightbox avant chaque test
    cy.visit('/pages/lightbox.html')
    
    // Attendre que Alpine.js soit chargé et initialisé
    cy.wait(1000)
    
    // S'assurer que la lightbox est fermée au début
    cy.window().then((win) => {
      if (win.document.querySelector('[x-show="isLightboxVisible"]').style.display !== 'none') {
        // Si la lightbox est ouverte, la fermer
        cy.get('body').click(10, 10)
        cy.wait(500)
      }
    })
  })

  it('1. Tester l\'ouverture de la lightbox au clic sur l\'image', () => {
    // Vérifier que la lightbox n'est pas visible initialement
    cy.get('[x-show="isLightboxVisible"]').should('not.be.visible')
    
    // Vérifier que l'image principale est visible
    cy.get('img[src="https://picsum.photos/id/301/1024/1024"]').first().should('be.visible')
    
    // Cliquer sur l'image pour ouvrir la lightbox
    cy.get('.relative.w-64.cursor-pointer').click()
    
    // Vérifier que la lightbox devient visible
    cy.get('[x-show="isLightboxVisible"]').should('be.visible')
    
    // Vérifier que l'image dans la lightbox est affichée
    cy.get('#lightbox img[src="https://picsum.photos/id/301/1024/1024"]').should('be.visible')
    
    // Vérifier que le body a l'overflow hidden (pour empêcher le scroll de la page)
    cy.get('body').should('have.css', 'overflow', 'hidden')
  })

  it('2. Tester la fermeture de la lightbox au clic en dehors de la lightbox', () => {
    // Ouvrir d'abord la lightbox
    cy.get('.relative.w-64.cursor-pointer').click()
    
    // Vérifier que la lightbox est ouverte
    cy.get('[x-show="isLightboxVisible"]').should('be.visible')
    
    // Cliquer en dehors de la lightbox (sur le fond noir/overlay)
    cy.get('[x-show="isLightboxVisible"]').click(10, 10)
    
    // Vérifier que la lightbox se ferme
    cy.get('[x-show="isLightboxVisible"]').should('not.be.visible')
    
    // Vérifier que le body retrouve son overflow normal
    cy.get('body').should('have.css', 'overflow', 'visible')
  })

  it('3. Tester l\'ajout de la mention "j\'aime" et la mise à jour des compteurs', () => {
    // Ouvrir la lightbox
    cy.get('.relative.w-64.cursor-pointer').click()
    
    // Vérifier que la lightbox est ouverte
    cy.get('[x-show="isLightboxVisible"]').should('be.visible')
    
    // Attendre que la lightbox soit complètement chargée
    cy.wait(500)
    
    // Scroller vers la section des likes dans la lightbox
    cy.get('#lightbox').within(() => {
      cy.get('svg[title="Like"]').scrollIntoView()
    })
    
    // Vérifier que le compteur de likes initial est à 0
    cy.get('#lightbox').within(() => {
      cy.get('[x-text="likesCount"]').should('contain', '0')
    })
    
    // Vérifier que l'icône "like" (coeur vide) est visible
    cy.get('#lightbox').within(() => {
      cy.get('svg[title="Like"][x-show="! isLiked"]').should('be.visible')
      cy.get('svg[title="Dislike"][x-show="isLiked"]').should('not.be.visible')
    })
    
    // Cliquer sur le bouton "j'aime"
    cy.get('#lightbox').within(() => {
      cy.get('svg[title="Like"][x-show="! isLiked"]').click()
    })
    
    // Vérifier que le compteur passe à 1
    cy.get('#lightbox').within(() => {
      cy.get('[x-text="likesCount"]').should('contain', '1')
    })
    
    // Vérifier que l'icône change (coeur plein rouge visible, coeur vide caché)
    cy.get('#lightbox').within(() => {
      cy.get('svg[title="Like"][x-show="! isLiked"]').should('not.be.visible')
      cy.get('svg[title="Dislike"][x-show="isLiked"]').should('be.visible')
    })
    
    // Fermer la lightbox
    cy.get('[x-show="isLightboxVisible"]').click(10, 10)
    
    // Survol de l'image pour voir l'overlay
    cy.get('.relative.w-64.cursor-pointer').trigger('mouseover')
    
    // Vérifier que le compteur dans l'overlay affiche aussi 1
    cy.get('[x-text="likesCount"]').first().should('contain', '1')
  })

  it('4. Tester la suppression de la mention "j\'aime" et la mise à jour des compteurs', () => {
    // Ouvrir la lightbox
    cy.get('.relative.w-64.cursor-pointer').click()
    
    // Vérifier que la lightbox est ouverte
    cy.get('[x-show="isLightboxVisible"]').should('be.visible')
    
    // Attendre que la lightbox soit complètement chargée
    cy.wait(500)
    
    // Scroller vers la section des likes dans la lightbox
    cy.get('#lightbox').within(() => {
      cy.get('svg[title="Like"]').scrollIntoView()
    })
    
    // D'abord ajouter un "j'aime" pour pouvoir le supprimer
    cy.get('#lightbox').within(() => {
      cy.get('svg[title="Like"][x-show="! isLiked"]').click()
    })
    
    // Vérifier que le compteur est maintenant à 1
    cy.get('#lightbox').within(() => {
      cy.get('[x-text="likesCount"]').should('contain', '1')
    })
    
    // Vérifier que l'icône "dislike" (coeur plein rouge) est visible
    cy.get('#lightbox').within(() => {
      cy.get('svg[title="Dislike"][x-show="isLiked"]').should('be.visible')
      cy.get('svg[title="Like"][x-show="! isLiked"]').should('not.be.visible')
    })
    
    // Cliquer sur le bouton "dislike" pour supprimer le "j'aime"
    cy.get('#lightbox').within(() => {
      cy.get('svg[title="Dislike"][x-show="isLiked"]').click()
    })
    
    // Vérifier que le compteur revient à 0
    cy.get('#lightbox').within(() => {
      cy.get('[x-text="likesCount"]').should('contain', '0')
    })
    
    // Vérifier que l'icône revient à l'état initial (coeur vide visible, coeur plein caché)
    cy.get('#lightbox').within(() => {
      cy.get('svg[title="Like"][x-show="! isLiked"]').should('be.visible')
      cy.get('svg[title="Dislike"][x-show="isLiked"]').should('not.be.visible')
    })
    
    // Fermer la lightbox
    cy.get('[x-show="isLightboxVisible"]').click(10, 10)
    
    // Survol de l'image pour voir l'overlay
    cy.get('.relative.w-64.cursor-pointer').trigger('mouseover')
    
    // Vérifier que le compteur dans l'overlay affiche aussi 0
    cy.get('[x-text="likesCount"]').first().should('contain', '0')
  })

  it('5. Tester l\'ajout d\'un commentaire', () => {
    // Ouvrir la lightbox
    cy.get('.relative.w-64.cursor-pointer').click()
    
    // Vérifier que la lightbox est ouverte
    cy.get('[x-show="isLightboxVisible"]').should('be.visible')
    
    // Attendre que la lightbox soit complètement chargée
    cy.wait(500)
    
    // Scroller vers le bas pour voir le formulaire de commentaire
    cy.get('#lightbox').within(() => {
      cy.get('input[name="comment"]').scrollIntoView()
    })
    
    // Vérifier qu'il n'y a pas de lien "Show comments" visible initialement (car pas de commentaires)
    cy.get('#lightbox').within(() => {
      cy.get('[x-text="displayCommentText()"]').should('not.be.visible')
    })
    
    // Vérifier que le bouton "Publish" est désactivé initialement
    cy.get('#lightbox').within(() => {
      cy.get('button[type="submit"]').should('be.disabled')
    })
    
    // Saisir un commentaire dans le champ input
    const commentText = 'Ceci est un commentaire de test'
    cy.get('#lightbox').within(() => {
      cy.get('input[name="comment"]').type(commentText)
    })
    
    // Vérifier que le bouton "Publish" devient activé
    cy.get('#lightbox').within(() => {
      cy.get('button[type="submit"]').should('not.be.disabled')
    })
    
    // Cliquer sur le bouton "Publish"
    cy.get('#lightbox').within(() => {
      cy.get('button[type="submit"]').click()
    })
    
    // Attendre que le commentaire soit ajouté
    cy.wait(500)
    
    // Vérifier que le commentaire apparaît dans la liste
    cy.get('#lightbox').within(() => {
      cy.get('[x-text="comment.body"]').should('contain', commentText)
      cy.get('[x-text="comment.author"]').should('contain', 'johndoe')
    })
    
    // Vérifier que le lien "Hide 1 comment" apparaît maintenant
    cy.get('#lightbox').within(() => {
      cy.get('[x-text="displayCommentText()"]').should('be.visible').and('contain', 'Hide 1 comment')
    })
    
    // Vérifier que le champ input est vide après publication
    cy.get('#lightbox').within(() => {
      cy.get('input[name="comment"]').should('have.value', '')
    })
    
    // Vérifier que le bouton "Publish" est à nouveau désactivé
    cy.get('#lightbox').within(() => {
      cy.get('button[type="submit"]').should('be.disabled')
    })
    
    // Fermer la lightbox
    cy.get('[x-show="isLightboxVisible"]').click(10, 10)
    
    // Survol de l'image pour voir l'overlay
    cy.get('.relative.w-64.cursor-pointer').trigger('mouseover')
    
    // Vérifier que le compteur de commentaires dans l'overlay affiche 1
    cy.get('[x-text="commentsCount()"]').first().should('contain', '1')
  })

  it('6. Tester que l\'ajout d\'un commentaire vide soit impossible car le bouton "Publish" reste désactivé', () => {
    // Ouvrir la lightbox
    cy.get('.relative.w-64.cursor-pointer').click()
    
    // Vérifier que la lightbox est ouverte
    cy.get('[x-show="isLightboxVisible"]').should('be.visible')
    
    // Attendre que la lightbox soit complètement chargée
    cy.wait(500)
    
    // Scroller vers le bas pour voir le formulaire de commentaire
    cy.get('#lightbox').within(() => {
      cy.get('input[name="comment"]').scrollIntoView()
    })
    
    // Vérifier que le bouton "Publish" est désactivé initialement
    cy.get('#lightbox').within(() => {
      cy.get('button[type="submit"]').should('be.disabled')
    })
    
    // Taper quelques caractères puis les supprimer pour tester la validation
    cy.get('#lightbox').within(() => {
      cy.get('input[name="comment"]').type('Test')
    })
    
    // Vérifier que le bouton devient activé quand il y a du contenu
    cy.get('#lightbox').within(() => {
      cy.get('button[type="submit"]').should('not.be.disabled')
    })
    
    // Supprimer tout le contenu
    cy.get('#lightbox').within(() => {
      cy.get('input[name="comment"]').clear()
    })
    
    // Vérifier que le bouton redevient désactivé
    cy.get('#lightbox').within(() => {
      cy.get('button[type="submit"]').should('be.disabled')
    })
    
    // Taper seulement des espaces
    cy.get('#lightbox').within(() => {
      cy.get('input[name="comment"]').type('   ')
    })
    
    // Vérifier que le bouton reste activé (car la validation se base sur la longueur, pas sur le contenu)
    cy.get('#lightbox').within(() => {
      cy.get('button[type="submit"]').should('not.be.disabled')
    })
    
    // Supprimer les espaces
    cy.get('#lightbox').within(() => {
      cy.get('input[name="comment"]').clear()
    })
    
    // Vérifier une dernière fois que le bouton est désactivé
    cy.get('#lightbox').within(() => {
      cy.get('button[type="submit"]').should('be.disabled')
    })
    
    // Vérifier qu'aucun commentaire n'a été ajouté
    cy.get('#lightbox').within(() => {
      cy.get('[x-text="displayCommentText()"]').should('not.be.visible')
    })
  })
})
