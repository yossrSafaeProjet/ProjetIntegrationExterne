const express = require('express');
const app = express();

const path = require('path');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
const SQLite3 = require('sqlite3').verbose();
const dbPath = path.join(__dirname, 'itineraries.db');
const db = new SQLite3.Database(dbPath);
app.use(express.static('Scripts'));
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
app.use(cookieParser())

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
let receivedToken="";
app.get('/',(req,res)=>res.redirect('/connexion'));
app.get('/connexion',(req,res)=> res.render('conexion'));
app.use(express.static('css'));
let userIdSaved=0;
app.post('/fetchData', async (req, res) => {
    let authToken = req.cookies.token;
    authToken = authToken.replace(/^Bearer\s/, '');
    
    try {

      const response = await fetch('http://localhost:3000/auth/login',{
        method:'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: req.body.email,
            password: req.body.password,
    })
});    
const responseVerifyToken=await fetch('http://localhost:3000/verify',{
    method:'POST',
    headers:{

       'Content-Type': 'application/json'
         },
         body: JSON.stringify({token:authToken})
         
     });
     const userData=await responseVerifyToken.json();
    
    const user=userData.user; 
    userIdSaved=user;

        if (response.status === 401) {
            // Renvoyer une réponse JSON avec le statut 400 et le message d'erreur
             res.redirect('/connexion');
        } else if(response.status=== 200) {
        authToken = response.headers.get('Authorization');
        //console.log('Token récupéré côté client :', authToken);
        res.appendHeader('Set-Cookie', 'token=' + authToken);
        return res.render('espace');
        }
    } catch (error) {
        console.error('pas', error);
 }
});



// Récupérer le token depuis le cookie
app.get('/inscription',(req,res)=>res.render('inscription',{ mode: 'inscription' }));
app.get('/modification',(req,res)=>res.render('inscription',{ mode: 'modification' }));




app.get('/espace',(req,res)=>res.render('espace'));
app.post('/inscriptions', async (req, res) => {
    try {
        // Effectuer la requête vers le serveur pour enregistrer l'utilisateur
        const response = await fetch('http://localhost:3000/enregistrerUtilisateur/enregistrer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nom:req.body.nom,
                prenom: req.body.prenom,
                email: req.body.email,
                password: req.body.password,
                confirmationMotDePasse: req.body.confirmationMotDePasse
            })
        });

        if(response.status===200){

            res.redirect('/connexion');
        }
   
    } catch (error) {
        console.error(error.message);
        // Gérer l'erreur, par exemple, renvoyer un message d'erreur au client
        res.status(400).json({ error: error.message });
    }
});
/*app.post('/ficheItineraire/:id', async (req, res) => {
    console.log("id");
    const itineraireId = parseInt(req.params.id, 10);
    const db = new SQLite3.Database(dbPath);
    // Requête SQL pour récupérer l'itinéraire par ID
    const sql = 'SELECT * FROM itineraries WHERE id = ?';
  
    // Exécutez la requête avec le paramètre itineraireId
    db.get(sql, [itineraireId], async (err, row) => {
        if (err) {
            console.error('Erreur lors de la récupération de l\'itinéraire depuis la base de données:', err.message);
            res.status(500).json({ error: 'Erreur lors de la récupération de l\'itinéraire' });
        } else if (row) {
            // Informations de l'itinéraire récupérées avec succès
            const itineraireInfo = row;

            // Récupération du token depuis les cookies
            const token = req.cookies.token;
            const tokenSansBearer = token.replace(/^Bearer\s/, '');

            try {
                // Envoi du token et des informations de l'itinéraire au serveur systemepdf
                const response = await fetch('http://localhost:5000/itineraire', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        token: tokenSansBearer,
                        itineraireInfo: itineraireInfo  // Passer les informations de l'itinéraire
                    })
                });

                console.log("les information ",itineraireInfo );

                // Envoyez la réponse au client, ou effectuez toute autre action nécessaire
                res.status(response.status).json({ success: true, message: "Informations d'itinéraire envoyées avec succès" });
            } catch (error) {
                console.error("Erreur lors de la requête fetch :", error.message);
                res.status(500).json({ success: false, message: "Erreur lors de la requête fetch" });
            }
        } else {
            res.status(404).json({ error: 'Itinéraire non trouvé' });
        }
    });
});

app.get("/getFichierPdf/:id", (req, res) =>{
    const itineraireId = req.params.id;
    const currentDirectory = __dirname;
    const pdfFilePath = path.join(currentDirectory, "itineraire.pdf");
    fs.readFile(pdfFilePath, (err, data) => {
        if (err) {
            console.error('Erreur lors de la lecture du fichier PDF:', err.message);
            res.status(500).send('Erreur lors de la lecture du fichier PDF');
        } else {
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=itineraire.pdf`);
            res.send(data);
        }
    });
}); */
app.get("/ficheItineraire", (req, res) =>{
    return res.render("ficheIteneraire");
});
let compteur=0;
function generateItineraryName() {
    // Convertir l'ID de l'utilisateur en une lettre, par exemple, 'A' pour 1, 'B' pour 2, etc.
    const letter = String.fromCharCode('A'.charCodeAt(0) + compteur);
    compteur++;
    // Concaténer la lettre avec le mot "itinéraire"
    const itineraryName = "itinéraire " + letter;
  
    return itineraryName;
  }


app.get("/getIteneraires", async (req, res) => {
    try {
        const token = req.cookies.token;
        tokenSansBearer = token.replace(/^Bearer\s/, '');
        const verifyResponse = await fetch('http://localhost:3000/verify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: tokenSansBearer
            })
        });

        if (verifyResponse.ok) {
            const verifyData = await verifyResponse.json();
            //console.log('Token reçu côté serveur:', verifyData);
            const db = new SQLite3.Database(dbPath);
            const userId = verifyData.user.userId; // Assurez-vous que votre token a un champ 'sub' avec l'ID utilisateur
            //console.log("id::",userId);
            db.all('SELECT * FROM itineraries WHERE idUser = ?', [userId], (err, rows) => {
                if (err) {
                    console.error('Erreur lors de la récupération des itinéraires depuis la base de données:', err.message);
                    res.status(500).json({ error: 'Erreur lors de la récupération des itinéraires' });
                } else {
                    res.json(rows);

                }
            });
        } else {
            console.log('Validation du token échouée');
            res.status(401).json({ error: 'Validation du token échouée' });
        }
    } catch (error) {
        console.error('Erreur générale:', error.message);
        res.status(500).json({ error: 'Erreur générale' });
    }
});

const geolib = require('geolib'); // Assurez-vous d'avoir installé cette bibliothèque via npm install geolib
app.get('/station',(req,res)=>res.render('stations'));
const distances = [];
let stationsWithDistances = [];
app.post('/station', (req, res) => {
    // Supposons que les waypoints soient passés dans la requête
    const waypoints = req.body.waypoints;

    if (!waypoints || waypoints.length === 0) {
        return res.status(400).json({ error: 'Les waypoints ne sont pas spécifiés ou mal définis.' });
    }

    fetch('https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/velib-disponibilite-en-temps-reel/records?limit=5&timestamp=${Date.now()}')
        .then(response => response.json())
        .then(data => {
            if (data && typeof data === 'object') { // Modification ici
                const record = data; // Modification ici
/*                 const recordJson=JSON.stringify(record, null, 2);
    console.log(record.coordonnees_geo.object); */
  /*   const coordinates=record.results[0].coordonnees_geo.lat;
    console.log(coordinates); */
    
for (let i = 0; i < record.results.length; i++) {
    const station = record.results[i];

    if (station.coordonnees_geo && station.coordonnees_geo.lat && station.coordonnees_geo.lon) {
        const distance = geolib.getDistance(
            { latitude: station.coordonnees_geo.lat, longitude: station.coordonnees_geo.lon },
            waypoints[0]
        );
        distances.push(distance);
        const stationWithDistance = {
            name: station.name,
            isInstalled: station.is_installed,
            bikesAvailable: station.numbikesavailable,
            capacity: station.capacity,
            distance: distance,
        };

        stationsWithDistances.push(stationWithDistance);
    } else {
        console.error('Les coordonnées géo sont absentes ou mal définies dans les données.');
    }
}
/* res.render('stations', { stations:stationsWithDistances} );  
 */          
res.render('stations', { stations:stationsWithDistances} ); 

                } 
 

        })
        .catch(error => {
            console.error('Erreur lors de la récupération des données côté serveur :', error);
            res.status(500).json({ error: 'Erreur lors de la récupération des données :' + error.message });
        });
        
});




app.post("/saveItineraire", (req, res) => {
    // Récupérez les données du corps de la requête
    const waypoints = req.body.waypoints;
    console.log("body",req.body);
    const userId=req.body.userId;
    if (waypoints && waypoints.length === 2) {
        // Utilisez 'let' au lieu de 'var' pour déclarer la variable db
        var routeJSON = JSON.stringify(waypoints);

        db.run("INSERT INTO itineraries (route,idUser,name) VALUES (?,?,?)",  [routeJSON, userId, generateItineraryName()]);
        db.all("SELECT * FROM itineraries", [], (err, rows) => {
            if (err) {
              console.error("Erreur lors de la récupération des données :", err.message);
            } else {
              console.log("Contenu de la table itineraries :", rows);
            }
          });
        res.status(200).json({ success: true, message: 'Données enregistrées avec succès côté serveur.' });
        
    } else {
        res.status(400).json({ error: 'Veuillez choisir un point de départ et un point d\'arrêt côté serveur.' });
    }
});
app.get('/carte',(req,res)=>res.render('carte'));
app.get('/logout', async (req, res) => {
    
    try {
        const responseDeconnexion = await fetch('http://localhost:3000/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user: userIdSaved })
        });
      
        if(responseDeconnexion.status===200){
            res.status(200).send('La déconnexion a été effectuée.');
        } else {
            console.error('La déconnexion a échoué. Statut du serveur:', responseDeconnexion.status);
            res.status(500).send('La déconnexion a échoué.');
        }
    } catch (error) {
        console.error('Erreur lors de la déconnexion', error);
    } 
 
});
app.get('/fetchInformations',(req,res)=>{

})
const port=process.env.PORT || 4000;
app.listen(port,()=>{
    console.log("Systéme itinéraire sur le port 4000");
});
