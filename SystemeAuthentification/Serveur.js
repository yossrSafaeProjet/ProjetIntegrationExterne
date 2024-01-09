const express = require('express');
const passport = require('passport');
const session = require('express-session');
const loginRouter = require('./Connexion');
const app = express();
app.set('view engine', 'ejs');

app.use(session({ secret: 'votre-secret', resave: true, saveUninitialized: true }));

// Initialisez passport après la configuration de la session
app.use(passport.initialize());
app.use(passport.session());
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('css'));
app.use(express.static('SystemeAuthentification'));

// Routes
app.get('/', (req, res) => res.redirect('/connexion'));
app.get('/connexion', (req, res) => {
  res.render('conexion', { message: '' });
});

app.get('/espace', (req, res) => {
  res.render('espace', { message: '' });
});

app.use('/', loginRouter); 

app.get('/inscription', (req, res) => {
  res.render('inscription');
});

const registrationRouter = require('./inscription');
app.use('/enregistrerUtilisateur', registrationRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Serveur en cours d'exécution sur le port ${port}`);
});
