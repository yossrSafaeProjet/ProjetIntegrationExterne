const express = require('express');
const app = express();

const path = require('path');
app.set('view engine', 'ejs');
const SQLite3 = require('sqlite3').verbose();
const dbPath = path.join(__dirname, 'itineraries.db');
const db = new SQLite3.Database(dbPath);
app.use(express.static('Scripts'));
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { error } = require('console');
app.use(cookieParser())

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
let receivedToken="";
app.get('/',(req,res)=>res.redirect('/connexion'));
app.get('/connexion',(req,res)=>res.render('conexion'));
app.use(express.static('css'));
app.post('/fetchData', async (req, res) => {
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

        if (response.status === 401) {
            // Renvoyer une réponse JSON avec le statut 400 et le message d'erreur
             res.redirect('/connexion');
        } else if(response.status=== 200) {
        authToken = response.headers.get('Authorization');
        console.log('Token récupéré côté client :', authToken);
        res.appendHeader('Set-Cookie', 'token=' + authToken);
        return res.render('espace');
        }
    } catch (error) {
        console.error('pas', error);
 }
});



// Récupérer le token depuis le cookie

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
app.get("/ficheItineraire", (req, res) =>{
    res.render("ficheIteneraire");
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
app.post("/saveItineraire", async(req, res) => {
    // Récupérez les données du corps de la requête
    const waypoints = req.body.waypoints;
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
app.get('/espace',(res,req)=>res.render('espace'));
const port=process.env.PORT || 4000;
app.listen(port,()=>{
    console.log("Systéme itinéraire sur le port 4000");
});
