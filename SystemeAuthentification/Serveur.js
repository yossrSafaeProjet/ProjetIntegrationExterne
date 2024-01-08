// server.js
const express = require('express');
const loginRouter = require('./Connexion');
const app = express();
app.set('view engine', 'ejs');

/* require('./Bdd'); */

app.use(express.static('css'));

// Routes
app.get('/', (req, res) => res.redirect('/connexion'));
app.get('/connexion', (req, res) => {
  res.render('conexion', { message: '' });
});

app.get('/espace', (req, res) => {
  res.render('espace', { message: '' });
});

 app.use('/', loginRouter); 

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Serveur en cours d'exécution sur le port ${port}`);
});