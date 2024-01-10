/* document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('myForm').addEventListener('submit', async function (event) {
        event.preventDefault(); // Empêcher le rechargement de la page après la soumission du formulaire

        var nom = document.getElementById('nom').value;
        var prenom = document.getElementById('prenom').value;
        var email = document.getElementById('email').value;
        var password = document.getElementById('password').value;
        var confirmationMotDePasse = document.getElementById('confirmationMotDePasse').value;

        var message = document.getElementById('message');

        // Vérifier si les mots de passe correspondent
        if (password !== confirmationMotDePasse) {
            message.textContent = "Les mots de passe ne correspondent pas. Veuillez réessayer.";
            return;
        } else {
            message.textContent = "";
        }

        try {
            // Effectuer la requête vers le serveur pour enregistrer l'utilisateur
            const response = await fetch('http://localhost:3000/enregistrerUtilisateur/enregistrer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nom: nom,
                    prenom: prenom,
                    email: email,
                    password: password,
                    confirmationMotDePasse: confirmationMotDePasse
                })
            });

            if (response.ok) {
                // Rediriger l'utilisateur vers une autre page (si nécessaire)
                window.location.href = '/connexion';
            } else {
                // Si la réponse n'est pas un succès, lire le message d'erreur de la réponse
                const errorData = await response.json();
                throw new Error(errorData.error);
            }
        } catch (error) {
            console.error(error.message);
            // Gérer l'erreur, par exemple, afficher un message d'erreur à l'utilisateur
            message.textContent = "Une erreur est survenue lors de l'enregistrement de l'utilisateur.";
        }
    });
});
 */