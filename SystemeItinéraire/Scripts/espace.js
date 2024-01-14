/* document.getElementById("itineraryForm").addEventListener("DOMContentLoaded", function(event) {
    event.preventDefault(); // Empêche le comportement par défaut du formulaire

    window.location.href = "/carte"; 
}); */

async function logout() {
try {
    const response = await fetch('http://localhost:4000/logout');
    // Ajoutez ici toute autre logique que vous souhaitez effectuer après la déconnexion
 if(response.status===200){
    window.location.href = "/connexion"; 
 }
} catch (error) {
    console.error('Erreur lors de la déconnexion', error);
}
}

// espace.js

function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) return match[2];
 }
 const authToken = getCookie('token');
 let tokenSansBearer="";
 if (authToken) {
    // Supprimer le préfixe "Bearer " du token
     tokenSansBearer = authToken.replace(/^Bearer\s/, '');
 
    console.log('Token récupéré côté client (sans "Bearer") :', tokenSansBearer);
 
    // Maintenant, vous pouvez utiliser "tokenSansBearer" comme nécessaire
 } else {
    console.log('Aucun token trouvé dans les cookies.');
 }
async function getData() {
    try {
     
      const responseVerifyToken = await fetch('http://localhost:3000/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token:tokenSansBearer })
      });
  
      const userData = await responseVerifyToken.json();
  
      if (responseVerifyToken.ok) {
        const userId = userData.user.userId;
  
        // Envoyez le userId avec la demande pour récupérer les informations personnelles
        const response = await fetch(`http://localhost:3000/informationPersonnelles/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
  
        const donneesUtilisateur = await response.json();
        const userDataJSON = encodeURIComponent(JSON.stringify(donneesUtilisateur));
        window.location.href = `/modification?userData=${userDataJSON}`;

    } }catch (error) {
      console.error('Erreur lors de la récupération des données', error);
    }
  }

  async function nouvelleItineraire(){
    try {
     
      const responseVerifyToken = await fetch('http://localhost:3000/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token:tokenSansBearer })
      });
  
      const userData = await responseVerifyToken.json();
  
      if (responseVerifyToken.ok) {
        fetch('http://localhost:4000/carte');
      }
    }catch(error){
      console.log("parsonne unthorized");
    }
  }
  