
const map = L.map('map').setView([48.8566, 2.3522], 13); // Coordonnées de Paris
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
   attribution: '© OpenStreetMap contributors'
}).addTo(map);

let waypoints = [];
let isSelected = false;
 function  setStart() {
   
      map.on('click', function (e) {
         waypoints = [];
         waypoints.push(e.latlng);
         L.marker(e.latlng).addTo(map);
         map.off('click');
         isSelected=true;
      });
      return isSelected;

}

async function getStationProchesDepart(){
   if(isSelected){

      try {
         const response = await fetch('http://localhost:4000/station', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ waypoints:waypoints, nearest: true })
        });
        console.log(response);
        const htmlContent = await response.text();
        console.log(htmlContent);
        document.getElementById('result-container').innerHTML = htmlContent;

        // Vérifier si la requête a réussi (statut 200 OK)
      } catch (error) {
         console.error("Erreur lors de la récupération des stations côté client", error.message);
         console.error(error.stack);      }
   }else{
      alert("Tu dois séléctionner un point de départ");
   }
}

async function getStationProchesDestination(){
   if(isSelectedEnd){

      try {
         const response = await fetch('http://localhost:4000/station', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ waypoints:waypoints, nearest: true })
        });
        console.log(response);
        const htmlContent = await response.text();
        console.log(htmlContent);
        document.getElementById('results-container').innerHTML = htmlContent;

        // Vérifier si la requête a réussi (statut 200 OK)
      } catch (error) {
         console.error("Erreur lors de la récupération des stations côté client", error.message);
         console.error(error.stack);      }
   }else{
      alert("Tu dois séléctionner un point de destination");
   }
}
let isSelectedEnd=false;
function setEnd() {

   map.on('click', function (e) {
      waypoints[1] = e.latlng;
      L.marker(e.latlng).addTo(map);
      map.off('click');
      isSelectedEnd=true;
   });
return isSelected;
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
function viewStations() {
   window.location.href = '/station';
}

 async function saveRoute() {
if(isSelected&&isSelectedEnd){
   const responseVerifyToken=await fetch('http://localhost:3000/verify',{
      method:'POST',
      headers:{

         'Content-Type': 'application/json'
           },
           body: JSON.stringify({token:tokenSansBearer})
           
       });
       console.log('token ici ')
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
      alert("La personne qui va ajouté un itinéraiure n'est pas autorisé!");
   }
}else{
   alert("Tu dois séléctionner ton point de départ et ton point de destination !");
}
}
L.Routing.control({
   waypoints: waypoints,
   routeWhileDragging: true
}).addTo(map);

