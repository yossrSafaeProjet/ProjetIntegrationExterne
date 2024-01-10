const express = require('express');
const passport = require('passport');
const session = require('express-session');
const loginRouter = require('./Connexion');
const app = express();
const path = require('path');

app.use(session({ secret: 'votre-secret', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('SystemeAuthentification'));


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

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Serveur en cours d'exécution sur le port ${port}`);
});
