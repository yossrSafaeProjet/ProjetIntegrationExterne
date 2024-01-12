const express = require('express');
const router = express.Router();
const path = require('path');
const SQLite3 = require('sqlite3');

const dbPath = path.join(__dirname, 'ma_base_de_donnees.db');
const db = new SQLite3.Database(dbPath);
router.post('/logout', (req, res) => {
    const userId = req.body.user.userId;  
    function revokeOtherUserTokens(userId) {
      db.run('UPDATE jwt_tokens SET is_revoked = 1 WHERE user_id = ?', [userId], (err) => {
        if (err) {
          console.error('Erreur lors de la révocation des autres JWT :', err);
          res.status(500).send('Erreur lors de la déconnexion des autres équipements.');
        } else {
          res.clearCookie('session-cookie');
          res.status(200).send('Déconnexion avec succcés');
          
        }
      });
    }
  
    revokeOtherUserTokens(userId);
  });
  module.exports = router;  