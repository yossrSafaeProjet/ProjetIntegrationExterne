const express = require('express');
const SQLite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const path = require('path');
const router = express.Router(); // Utilisez express.Router() pour créer un routeur
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

const dbPath = path.join(__dirname, 'ma_base_de_donnees.db');


router.post('/enregistrer', async(req, res) => {
  console.log("entre dans enregister");
  const utilisateur = req.body;
  const db = new SQLite3.Database(dbPath);
  // Vérifiez si les mots de passe correspondent
  if (utilisateur.password !== utilisateur.confirmationMotDePasse) {
    res.status(400).send('Les mots de passe ne correspondent pas. Veuillez réessayer.');
    return;
  }
  // Hasher le mot de passe
  bcrypt.hash(utilisateur.password, 10, (err, hashedPassword) => {
    if (err) {
      console.error(err);
      res.status(500).send('Erreur lors du hashage du mot de passe.');
      return;
    }

    // Insérez l'utilisateur dans la base de données avec le mot de passe hashé
    db.run(`
      INSERT INTO utilisateurs (nom, prenom, email, password) VALUES (?, ?, ?, ?)
    `, [utilisateur.nom, utilisateur.prenom, utilisateur.email, hashedPassword], (err) => {
      if (err) {
        console.log(db);
        console.error(err.message);
        res.status(500).send('Erreur lors de l\'enregistrement de l\'utilisateur.');
      } else {
        res.status(200).json({'status':'succés','message':'ok pour enregistrement'})
      }
    });
  });
});

router.patch('/:id', (req, res) => {
  const utilisateurId = req.params.id;
  const utilisateurModifie = req.body;
  const db = new SQLite3.Database(dbPath);

  // Vérifiez si les mots de passe correspondent
  if (utilisateurModifie.password && utilisateurModifie.password !== utilisateurModifie.confirmationMotDePasse) {
      res.status(400).send('Les mots de passe ne correspondent pas. Veuillez réessayer.');
      return;
  }

  // Hasher le nouveau mot de passe si fourni
  if (utilisateurModifie.password) {
      bcrypt.hash(utilisateurModifie.password, 10, (err, hashedPassword) => {
          if (err) {
              console.error(err);
              res.status(500).send('Erreur lors du hashage du mot de passe.');
              return;
          }

          // Mettez à jour l'utilisateur avec le mot de passe hashé
          db.run(`
              UPDATE utilisateurs SET nom = ?, prenom = ?, email = ?, password = ? WHERE id = ?
          `, [utilisateurModifie.nom, utilisateurModifie.prenom, utilisateurModifie.email, hashedPassword, utilisateurId], (err) => {
              if (err) {
                  console.error(err.message);
                  res.status(500).send('Erreur lors de la mise à jour de l\'utilisateur.');
              } else {
                  res.send('Utilisateur mis à jour avec succès.');
              }
          });
      });
  } else {
      // Si le mot de passe n'est pas modifié, mettez à jour l'utilisateur sans changer le mot de passe
      db.run(`
          UPDATE utilisateurs SET nom = ?, prenom = ?, email = ? WHERE id = ?
      `, [utilisateurModifie.nom, utilisateurModifie.prenom, utilisateurModifie.email, utilisateurId], (err) => {
          if (err) {
              console.error(err.message);
              res.status(500).send('Erreur lors de la mise à jour de l\'utilisateur.');
          } else {
              res.send('Utilisateur mis à jour avec succès.');
          }
      });
  }
});
module.exports = router;
