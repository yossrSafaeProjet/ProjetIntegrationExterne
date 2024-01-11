
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
 async function saveRoute() {
   console.log("aaaaa");

   try {
       const response = await fetch('http://localhost:4000/saveItineraire', {
           method: 'POST',
           headers: {
               'Content-Type': 'application/json'
           },
           body: JSON.stringify({ waypoints: waypoints })
       });

       const data = await response.json();
       console.log('Données enregistrées avec succès côté client', data);
   } catch (error) {
       console.error("Erreur lors de l'enregistrement côté client", error);
       // Gérer l'erreur côté client, par exemple, afficher un message à l'utilisateur
   }
}
L.Routing.control({
   waypoints: waypoints,
   routeWhileDragging: true
}).addTo(map);
