const SQLite3 = require('sqlite3').verbose();

// Création de la base de données
const db = new SQLite3.Database(__dirname + '/ma_base_de_donnees.db');

const bcrypt = require('bcrypt');
// Création de la table "utilisateurs"
db.run(`CREATE TABLE IF NOT EXISTS utilisateurs (
    id INTEGER PRIMARY KEY,
    nom TEXT,
    prenom TEXT,
    email TEXT,
    password TEXT
)`);
db.close();