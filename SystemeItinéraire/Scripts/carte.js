
const map = L.map('map').setView([51.505, -0.09], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
   attribution: '© OpenStreetMap contributors'
}).addTo(map);

var waypoints = [];

function setStart() {
   map.on('click', function (e) {
      waypoints[0] = e.latlng;
      L.marker(e.latlng).addTo(map);
      map.off('click');
   });
}

 function setEnd() {
   map.on('click', function (e) {
      waypoints[1] = e.latlng;
      L.marker(e.latlng).addTo(map);
      map.off('click');
   
   });
} 

function retour(){
   window.history.back();
}
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
 async function saveRoute() {
   const responseVerifyToken=await fetch('http://localhost:3000/verify',{
      method:'POST',
      headers:{

         'Content-Type': 'application/json'
           },
           body: JSON.stringify({token:tokenSansBearer})
           
       });
       const userData=await responseVerifyToken.json();
      
       if(responseVerifyToken.ok){
         const userId=userData.user.userId;
   try {
       const response = await fetch('http://localhost:4000/saveItineraire', {
           method: 'POST',
           headers: {
               'Content-Type': 'application/json'
           },
           body: JSON.stringify({ waypoints: waypoints,userId:userId})
       });
       

       const data = await response.json();
      alert('Données enregistrées avec succès');
   } catch (error) {
       console.error("Erreur lors de l'enregistrement côté client", error);
       // Gérer l'erreur côté client, par exemple, afficher un message à l'utilisateur
   }}else{
      alert("La personne qui va ajouté un itinéraiure est n'est pas autorisé!");
   }
}
L.Routing.control({
   waypoints: waypoints,
   routeWhileDragging: true
}).addTo(map);

