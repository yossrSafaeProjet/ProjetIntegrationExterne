const SQLite3 = require('sqlite3').verbose();

// Création de la base de données
const db = new SQLite3.Database(__dirname + '/itineraries.db');

// Création de la table "utilisateurs"
db.run(`CREATE TABLE IF NOT EXISTS itineraries (id INTEGER PRIMARY KEY AUTOINCREMENT, route TEXT, idUser Integer)
`);

db.close();