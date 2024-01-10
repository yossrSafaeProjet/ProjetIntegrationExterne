const express = require('express');
const app = express();
const FormData = require('form-data');
const path = require('path');
// Assurez-vous d'ajuster le chemin correctement
app.set('view engine', 'ejs');
const SQLite3 = require('sqlite3').verbose();
const dbPath = path.join(__dirname, 'itineraries.db');
app.use(express.static('Scripts'));
app.use(express.static('css'));
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/',(req,res)=>res.redirect('/connexion'));
app.get('/connexion',(req,res)=>res.render('conexion'));

app.post('/fetchData', async (req, res) => {
    try {
        const response = await fetch('http://localhost:3000/auth/login',{
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify({
            email: req.body.email,
            password: req.body.password,
    })
});    

        if (response.status === 401) {
            const errorData = await response.json();
            res.redirect('/connexion');
        } else if(response.status===200){
            // Vous pouvez également passer des données supplémentaires à votre modèle EJS
            const data = {
                message: 'Votre message ici'
            };
            
            // Rendre la page 'espace' avec les données
            return res.render('espace', data);
        }
    } catch (error) {
        console.error('pas', error);
 }
});

app.get('/inscription', (req, res) => {
    res.render('inscription');
});

app.post('/inscription', async (req, res) => {
    try {


        // Effectuer la requête vers le serveur pour enregistrer l'utilisateur
        const response = await fetch('http://localhost:3000/enregistrerUtilisateur', {
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

        // Vérifier la réponse du serveur
        if (!response.ok) {
            throw new Error('Erreur lors de l\'enregistrement de l\'utilisateur.');
        }

        // Afficher un message de succès
        alert('Utilisateur enregistré avec succès !');

        // Rediriger l'utilisateur vers une autre page (si nécessaire)
        res.redirect('/accueil');
    } catch (error) {
        console.error(error.message);
        // Gérer l'erreur, par exemple, renvoyer un message d'erreur au client
        res.status(400).json({ error: error.message });
    }
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

const port=process.env.PORT || 4000;
app.listen(port,()=>{
    console.log("Systéme itinéraire sur le port 4000");
});
