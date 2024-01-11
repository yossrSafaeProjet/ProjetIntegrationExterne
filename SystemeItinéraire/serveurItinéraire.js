const express = require('express');
const app = express();
const FormData = require('form-data');
const path = require('path');
app.set('view engine', 'ejs');
const SQLite3 = require('sqlite3').verbose();
const dbPath = path.join(__dirname, 'itineraries.db');
app.use(express.static('Scripts'));
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
app.use(cookieParser())

app.use(bodyParser.urlencoded({ extended: true }));
let authToken="";
let receivedToken="";
app.get('/',(req,res)=>res.redirect('/connexion'));
app.get('/connexion',(req,res)=>res.render('conexion'));
app.use(express.static('css'));
app.post('/fetchData', async (req, res) => {
    try {
        const form = new FormData();

        form.append('username', req.body.email);
        form.append('password', req.body.password);

        const response = await fetch('http://localhost:3000/auth/login',{
        method:'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: req.body.email,
            password: req.body.password,
    })
});     console.log(response.status);

        if (response.status === 401) {
            // Renvoyer une réponse JSON avec le statut 400 et le message d'erreur
             res.redirect('/connexion');
        } else {
        authToken = response.headers.get('Authorization');
        console.log('Token récupéré côté client :', authToken);
        res.appendHeader('Set-Cookie', 'token=' + authToken);
        return res.render('espace');
        }
    } catch (error) {
        console.error('pas', error);
 }
});


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

        // Vérifier la réponse du serveur

        // Afficher un message de succès
        if(response.status===200){


            // Rediriger l'utilisateur vers une autre page (si nécessaire)
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

app.post('/ficheItineraire', async (req, res) => {
    const token=req.cookies.token;
    res.send(token);
});
/* async function fetchData() {
    try {
        const response = await fetch(`${serveurAuthentification}/connexion`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (!response.ok) {
            console.error(`Error: ${response.status} - ${response.statusText}`);
            // Handle error response here
        } else {
            const html = await response.text(); 
            console.log(html);
            // Récupérer le texte HTML de la réponse
           return html;
        }
    } catch (error) {
        console.error('Error during fetch:', error);
    }
}

app.get('/fetchPage', async (req, res) => {
    const html = await fetchData();

    if (html !== null) {

        res.send(html);
        console.log(html);
    } else {
        res.status(500).send('Internal Server Error');
    }
});
 */
app.post("/saveItineraire", (req, res) => {
    // Récupérez les données du corps de la requête
    const waypoints = req.body.waypoints;
    console.log(waypoints);
    const db = new SQLite3.Database(dbPath);
    if (waypoints && waypoints.length === 2) {
        console.log(waypoints);
        // Utilisez 'let' au lieu de 'var' pour déclarer la variable db
        console.log(db);
        
        var routeJSON = JSON.stringify(waypoints);
        console.log(routeJSON);
        

        db.run("INSERT INTO itineraries (route) VALUES (?)", [routeJSON]);
        console.log('succès côté serveur');
        res.status(200).json({ success: true, message: 'Données enregistrées avec succès côté serveur.' });
    } else {
        res.status(400).json({ error: 'Veuillez choisir un point de départ et un point d\'arrêt côté serveur.' });
    }
});
app.get('/carte',(req,res)=>res.render('carte'));




const port=process.env.PORT || 4000;
app.listen(port,()=>{
    console.log("Systéme itinéraire sur le port 4000");
});
