
const express = require('express');
const passport = require('passport');
const SQLite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const path = require('path');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require('passport-jwt');
const JwtStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;
const jwt = require('jsonwebtoken');
const { error } = require('console');
const router = express.Router();
const dbPath = path.join(__dirname, 'ma_base_de_donnees.db');
const secretKey = 'aqzsedrftg';
router.use(express.json());
const db = new SQLite3.Database(dbPath);
// Configurations Passport
passport.use(new LocalStrategy(
    { usernameField: 'email' },
    (email, password, done) => {
        
        const db = new SQLite3.Database(dbPath);
        db.get('SELECT * FROM utilisateurs WHERE email = ?', [email], (err, row) => {
            if (err) {
                return done(err);
            }
            if (!row) {
                return done(null, false, { message: 'Utilisateur non trouvé.' });
            }

            bcrypt.compare(password, row.password, (bcryptErr, result) => {
                if (bcryptErr) {
                    return done(bcryptErr);
                }
                
                if (!result) {
                    console.log('Mot de passe incorrect');
                    return done(null, false, { message: 'Mot de passe incorrect.' });
                }
                return done(null, row);
            });
        });
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    const db = new SQLite3.Database(dbPath);
    db.get('SELECT * FROM utilisateurs WHERE id = ?', [id], (err, row) => {
        done(err, row);
    });
});
// Configuration du JWT
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secretKey,
    expiresIn: '1h' // Durée de validité du jeton ( 1 heure)
  };
  passport.use(new JwtStrategy(jwtOptions, (jwtPayload, done) => {
    // Récupération de l'ID de l'utilisateur à partir du JWT
    const userId = jwtPayload.userId;
  
    // Requête à la base de données pour charger les informations de l'utilisateur
    // Utilisez l'ID récupéré pour obtenir les détails de l'utilisateur depuis la base de données
    db.get('SELECT * FROM utilisateurs WHERE id = ?', [userId], (err, user) => {
      if (err) {
        return done(err, false);
      }
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  }));
  router.post('/login', async (req, res, next) => {
    passport.authenticate('local', async (err, user, info) => {
        if (err) {
            return next(err);
        }
       
        if (!user) {  
            res.status(401).json({ status: 'error', message: 'Identifiants incorrects.' });
            return;
        }
/*         res.status(200).json({ status: 'succès', message: 'ok pour les identifiants' });
 */
        req.logIn(user, async (loginErr) => {
            if (loginErr) {
                return next(loginErr);
            }
            
            try {
                const token = jwt.sign({
                    userId: user.id
                }, secretKey);
    
                const expirationTime = new Date(Date.now() + 3600000);
    
                // Insérer le JWT dans la base de données
                db.run('INSERT INTO jwt_tokens (user_id, token, expires_at, is_revoked) VALUES (?, ?, ?, 0)', [user.id, token, expirationTime], (insertErr) => {
                    if (insertErr) {
                        console.error('Erreur lors de l\'enregistrement du JWT :', insertErr);
                        return res.status(500).send('Erreur lors de la connexion');
                    } else {
                        console.log('JWT enregistré avec succès');
                        console.log(token);
                        res.set('Authorization', `Bearer ${token}`);
                        res.send(JSON.stringify({'status':'200','message':'succés'}));
                    }
                });
            } catch (error) {
                console.error('Erreur lors de la génération et de l\'enregistrement du JWT :', error);
                return res.status(500).send('Erreur lors de la connexion');
            }
        });
    })(req, res, next);
});

module.exports = router;
