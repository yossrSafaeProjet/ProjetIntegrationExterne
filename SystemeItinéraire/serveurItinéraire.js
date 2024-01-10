const express = require('express');
const app = express();
const FormData = require('form-data');
const path = require('path');
// Assurez-vous d'ajuster le chemin correctement
app.set('view engine', 'ejs');
const SQLite3 = require('sqlite3').verbose();
const dbPath = path.join(__dirname, 'itineraries.db');
app.use(express.static('Scripts'));
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/',(req,res)=>res.redirect('/connexion'));
app.get('/connexion',(req,res)=>res.render('conexion'));

app.post('/fetchData', async (req, res) => {
    try {
        const form = new FormData();

        form.append('username', req.body.email);
        form.append('password', req.body.password);

        const response = await fetch('http://localhost:3000/auth/login',{
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: form
    });
        
    if (!response.ok) {
        // Si le statut n'est pas 2xx (réussi), générer une erreur
        throw new Error(`Erreur de fetch: ${response.statusText}`);
    }

        if (response.status === 401) {
            const errorData = await response.json();
            // Renvoyer une réponse JSON avec le statut 400 et le message d'erreur
            return res.status(400).json(errorData);
        } else {
            // Vous pouvez également passer des données supplémentaires à votre modèle EJS
            const data = {
                message: 'Votre message ici'
            };
            
            // Rendre la page 'espace' avec les données
            return res.render('espace', data);
        }
    } catch (error) {
        console.error('Erreur lors de la récupération de la page de connexion:', error);
        // Renvoyer une réponse JSON avec le statut 500 en cas d'erreur
        return res.status(500).json({ error: 'Erreur lors de la récupération de la page de connexion' });
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
