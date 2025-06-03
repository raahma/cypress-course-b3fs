// Fonction pour chiffrer un texte avec le chiffre de César
function caesar(text, shift) {
    return text.split('').map(char => {
        // Vérifier si c'est une lettre
        if (char.match(/[a-z]/i)) {
            // Déterminer si c'est majuscule ou minuscule
            const isUpperCase = char === char.toUpperCase();
            const charCode = char.toLowerCase().charCodeAt(0);
            
            // Appliquer le décalage (a = 97, z = 122)
            let shiftedCode = ((charCode - 97 + shift) % 26) + 97;
            let shiftedChar = String.fromCharCode(shiftedCode);
            
            // Retourner en majuscule si nécessaire
            return isUpperCase ? shiftedChar.toUpperCase() : shiftedChar;
        }
        
        // Retourner le caractère inchangé s'il n'est pas une lettre
        return char;
    }).join('');
}

// Fonction pour initialiser l'application
function initCaesarCypher() {
    const cypherKeyInput = document.getElementById('cypherKey');
    const inputTextArea = document.getElementById('inputText');
    const cypherBtn = document.getElementById('cypherBtn');
    const resultDiv = document.getElementById('result');
    
    // Fonction pour effectuer le chiffrement
    function performCypher() {
        const text = inputTextArea.value;
        const shift = parseInt(cypherKeyInput.value) || 0;
        
        if (text.trim() === '') {
            resultDiv.textContent = 'Veuillez entrer un texte à chiffrer';
            resultDiv.style.color = '#dc3545';
            return;
        }
        
        const encryptedText = caesar(text, shift);
        resultDiv.textContent = encryptedText;
        resultDiv.style.color = '#28a745';
    }
    
    // Événement sur le bouton
    cypherBtn.addEventListener('click', performCypher);
    
    // Événement sur la touche Entrée dans le textarea
    inputTextArea.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            performCypher();
        }
    });
    
    // Événement sur la touche Entrée dans l'input de la clé
    cypherKeyInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            performCypher();
        }
    });
}

// Initialiser l'application quand le DOM est chargé
document.addEventListener('DOMContentLoaded', initCaesarCypher);

// Test de la fonction (pour vérification)
console.log(caesar('Hello World!', 6)); // Nkrru Cuxrj!