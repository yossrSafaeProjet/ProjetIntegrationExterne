
const map = L.map('map').setView([48.8566, 2.3522], 13); // Coordonnées de Paris
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
   attribution: '© OpenStreetMap contributors'
}).addTo(map);

let waypoints = [];
let isSelected = false;

function setStart() {
   map.on('click', function (e) {
       waypoints = [];
       waypoints.push({
           latitude: e.latlng.lat,
           longitude: e.latlng.lng
       });
       L.marker(e.latlng).addTo(map);
       map.off('click');
       isSelected = true;
   });
   return isSelected;
}

async function getStationProches() {
    if (isSelected) {
        try {
            const response = await fetch('http://localhost:4000/station', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ waypoints: waypoints, nearest: true })
            });

            const htmlContent = await response.text();
            document.getElementById('result-container').innerHTML = htmlContent;

            // Vérifier si la requête a réussi (statut 200 OK)
        } catch (error) {
            console.error("Erreur lors de la récupération des stations côté client", error.message);
            console.error(error.stack);
        } finally {
            // Réinitialiser isSelected après la requête
            isSelected = false;
        }
    } else {
        alert("Tu dois sélectionner un point de départ");
    }
}
let additionalDataFromInfoStation = {};
async function getInfoStation(checkbox) {
   console.log("jjjj");

   const stationName = checkbox.id.substring(8); 

   if (checkbox.checked) {
       console.log("La case à cocher est cochée pour la station : ", stationName);
       const latitude = checkbox.parentNode.querySelector('.hidden[data-type="latitude"]');
       const longitude = checkbox.parentNode.querySelector('.hidden[data-type="longitude"]');

       const latitudeText = latitude ? latitude.innerText : '';
       const longitudeText = longitude ? longitude.innerText : '';


       // Effectuez votre requête HTTP ici
       fetch('http://localhost:4000/infoStation', {
           method: 'POST',
           headers: {
               'Content-Type': 'application/json'
           },
           body: JSON.stringify({ stationName: stationName, latitude:latitudeText,longitude:longitudeText})
       })
       .then(response => response.json()
       )
       .then(data => {
         additionalDataFromInfoStation = data.stationData;
       })
       .catch(error => {
           console.error('Erreur lors de la requête vers ', error);
       });
   } else {
       console.error('Noon');
   }
}

function setEnd() {
return new Promise(resolve => {
   map.on('click', function (e) {
      waypoints[1] = e.latlng;
      L.marker(e.latlng).addTo(map);
      map.off('click');
      resolve();
   });
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
function viewStations() {
   window.location.href = '/station';
}

 async function saveRoute() {
 /*  await setStart();
  await setEnd(); */
  console.log("ouiii",additionalDataFromInfoStation.latitude);
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
           body: JSON.stringify({ waypoints: waypoints,userId:userId,infoStation: additionalDataFromInfoStation})
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

