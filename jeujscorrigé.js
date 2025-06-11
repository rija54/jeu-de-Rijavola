var perso = document.querySelector(".perso");
var obstacles = document.querySelector(".obstacles");
var scoreElement = document.getElementById("score"); // Mieux de cibler par ID pour le score
var scoreValue = 0;

// La variable `dejaCompte` doit être gérée par cycle d'obstacle
// Elle doit être à `false` quand l'obstacle apparaît (ou redémarre son animation)
// et passer à `true` une fois que le score est incrémenté pour cet obstacle.
// On va la gérer au niveau de l'animation de l'obstacle.
let obstaclePasse = false; // Renommé pour plus de clarté, indique si l'obstacle a déjà été "passé" pour le score

function VOL() {
    // Fonction pour faire sauter le personnage
    if (!perso.classList.contains("animation")) { // Utiliser contains pour vérifier si la classe existe
        perso.classList.add('animation');
    }
    setTimeout(function() {
        perso.classList.remove('animation');
    }, 500);
}

// *** Point d'erreur crucial et sa correction ***
// Pour que le score s'incrémente correctement, nous devons détecter quand l'obstacle
// est passé derrière le personnage, et non seulement quand il est dans une certaine zone.
// Et `obstaclePasse` doit être réinitialisé quand l'animation de l'obstacle recommence.

// Écouteur d'événement pour détecter la fin de l'animation de l'obstacle.
// Quand l'animation de l'obstacle recommence, c'est le signe qu'un nouvel "obstacle" arrive.
obstacles.addEventListener('animationiteration', () => {
    // À chaque fois que l'animation de l'obstacle se termine et recommence,
    // on considère qu'un nouvel obstacle arrive, donc on réinitialise `obstaclePasse`.
    obstaclePasse = false;
});


// Vérification principale du jeu (collision et score)
var verification = setInterval(function() {
    var persoTop = parseInt(window.getComputedStyle(perso).getPropertyValue("top"));
    var obstaclesLeft = parseInt(window.getComputedStyle(obstacles).getPropertyValue("left"));

    // --- LOGIQUE DE DÉTECTION DE COLLISION (Fin de partie) ---
    // Les valeurs `70` et `-40` pour `obstaclesLeft` définissent une zone de collision.
    // `persoTop >= 10` indique que le personnage est "en bas" ou pas en plein saut.
    // Il faut ajuster ces valeurs pour qu'elles correspondent précisément à la collision visuelle.
    // Une meilleure détection avec `getBoundingClientRect()` est préférable, mais pour rester dans votre code:
    // Vérifiez si l'obstacle chevauche le personnage horizontalement ET verticalement
    // (Les valeurs sont indicatives, vous devrez les ajuster finement)
    const persoRect = perso.getBoundingClientRect();
    const obstaclesRect = obstacles.getBoundingClientRect();
    
    // Détection de collision plus fiable en utilisant les rectangles des éléments
    if (
        persoRect.left < obstaclesRect.right &&
        persoRect.right > obstaclesRect.left &&
        persoRect.top < obstaclesRect.bottom &&
        persoRect.bottom > obstaclesRect.top
    ) {
        // Collision détectée
        obstacles.style.animation = "none"; // Arrête l'animation des obstacles
        // Pas besoin de repositionner, l'animation est arrêtée
        
        alert("Partie Terminée ! Votre score : " + scoreValue);
        
        // Réinitialisation du jeu après la défaite
        scoreValue = 0;
        scoreElement.textContent = "Score : " + scoreValue; // Mise à jour de l'affichage du score
        obstaclePasse = false; // Réinitialise l'état de l'obstacle pour la prochaine partie

        // Pour relancer le jeu, vous devez redémarrer l'animation de l'obstacle.
        // Cela peut se faire via un bouton "Rejouer" ou un rechargement de la page.
        // Pour un redémarrage simple ici (à améliorer pour un vrai bouton "Rejouer"):
        setTimeout(() => {
            obstacles.style.animation = "anime-obstacles 2s linear infinite"; // Redémarre l'animation
        }, 100); // Court délai pour s'assurer que le style "none" a bien été appliqué
    }

    // --- LOGIQUE D'INCLEMENTATION DU SCORE (Passage d'obstacle) ---
    // Le score doit augmenter quand l'obstacle est **passé** le personnage.
    // La condition `obstaclesLeft < 0` signifie que l'obstacle est sorti complètement à gauche.
    // C'est le moment idéal pour incrémenter le score pour cet "obstacle" et le marquer comme "passé".
    if (obstaclesLeft < 0 && !obstaclePasse) { // Si l'obstacle est sorti et qu'il n'a pas encore été compté
        scoreValue++;
        scoreElement.textContent = "Score : " + scoreValue;
        obstaclePasse = true; // Marque l'obstacle comme compté pour ce cycle
    }
    // Votre CSS relance l'animation de `anime-obstacles` dès qu'elle est terminée
    // (grâce à `infinite`). L'événement `animationiteration` capturera cela.

}, 10); // Vérification toutes les 10ms pour une bonne réactivité

// console.log(obstaclesLeft, persoTop); // Garder pour le débogage si besoin