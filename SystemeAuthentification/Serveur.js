const express = require('express');
const passport = require('passport');
const session = require('express-session');
const loginRouter = require('./Connexion');
const app = express();
app.set('view engine', 'ejs');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const secretKey = 'aqzsedrftg';

app.use(session({ secret: 'session_key', resave: true, saveUninitialized: true }));

// Initialisez passport après la configuration de la session
app.use(passport.initialize());
app.use(passport.session());
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('SystemeAuthentification'));
app.use(cors());

// Assurez-vous que le chemin des vues est correct


// Routes
/* app.get('/',(req,res)=>
res.redirect('/connexion')
); */


/* app.get('/addition',(req,res)=>{
  res.appendHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({message: req.query.nb1 + req.query.nb2}));
}) */


/* app.get('/connexion', (req, res) => {
  res.render('conexion', { message: '' });
}); */

/* app.get('/espace', (req, res) => {
  res.render('espace', { message: '' });
}); */

app.use('/auth', loginRouter);

/* app.get('/inscription', (req, res) => {
  res.render('inscription');
}); */

const registrationRouter = require('./inscription');
app.use('/enregistrerUtilisateur', registrationRouter);

app.get('/stations', (req, res) => {
  fetch('https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/velib-disponibilite-en-temps-reel/records?limit=5')
    .then(response => response.json())
    .then(data => {
      if (data && data.results && Array.isArray(data.results)) {
        const stations = data.results.map(record => {
          return {
            name: record.name,
            isInstalled: record.is_installed,
            bikesAvailable: record.numbikesavailable,
            capacity: record.capacity
          };
        });
        res.render('stations', { stations }); // Rend la page stations.ejs avec les données stations
      } else {
        res.send('La structure des données retournées est incorrecte.');
      }
    })
    .catch(error => {
      res.send('Erreur lors de la récupération des données :' + error);
    });
});
// Route de vérification du token JWT
app.post('/verify', (req, res) => {
  const token = req.body.token; // Récupérer le token du corps de la requête

  if (!token) {
    console.error('Token non fourni dans la requête.');
    return res.status(400).json({ valid: false, message: 'Token non fourni' });
  }

  console.log("Le token reçu côté serveur:", token);

  console.log(req.body);
  // Vérifier si le token est valide en utilisant jwt.verify
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      console.error('Erreur lors de la vérification du token:', err.message);
      return res.status(401).json({ valid: false, message: 'Token invalide' });
    } else {
      console.log('Le token est valide.');
      return res.status(200).json({ valid: true, message: 'Token valide' ,user:decoded });
    }
  });
});



function decodeToken(token) {
  // Ici, vous devez décoder et valider le token JWT
  try {
    // Vérifier et décoder le token avec votre clé secrète
    const decoded = jwt.verify(token, secretKey);
    return decoded; // Retourner les informations du token décodé si la vérification est réussie
  } catch (error) {
    throw new Error('Erreur lors du décodage du token');
  }
}
// Fonction pour extraire l'ID de l'utilisateur à partir du token
async function getUserIdFromToken(token) {

  // En supposant que votre token JWT contient un champ "userId"
  const decodedToken = decodeToken(token);
  return decodedToken.userId; // Supposons que userId est stocké dans le token
}
app.get('/userItineraries', async (req, res) => {
  const { token } = req.query;

  try {
    // Ici, vous devrez valider le token et extraire l'ID de l'utilisateur
    // puis utiliser cet ID pour récupérer la liste des itinéraires de cet utilisateur depuis la base de données

    // Supposons que vous avez récupéré l'ID de l'utilisateur à partir du token
    const userId = getUserIdFromToken(token);

    // Récupérez la liste des itinéraires pour cet utilisateur depuis la base de données
    //const userItineraries = getUserItineraries(userId);
    userItineraries=[];

    // Rendre la page EJS avec les données des itinéraires pour l'utilisateur
    res.render('espace', { userItineraries });
  } catch (error) {
    console.error('Erreur lors de la récupération des itinéraires de l\'utilisateur :', error);
    res.status(500).send('Erreur lors de la récupération des itinéraires de l\'utilisateur');
  }
});
const deconnexionRoute=require('./Deconnexion');
app.use('',deconnexionRoute);
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Serveur en cours d'exécution sur le port ${port}`);
});
