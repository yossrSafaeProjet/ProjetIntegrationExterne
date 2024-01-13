const express = require('express');
const axios = require('axios');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());


app.post('/itineraire', async (req, res) => {
  try {
    const token = req.body.token;
    const itineraireInfo=req.body.itineraireInfo;

    const verifyResponse = await fetch('http://localhost:3000/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token: token
      })
    });
    console.log('Token reçu côté serveur:', token);
    if (verifyResponse.ok) {
      console.log('Token validé avec succès');
        // Générer le PDF avec pdfkit
        const pdfFileName = 'itineraire.pdf'; // Nom du fichier PDF

        const pdfDoc = new PDFDocument();
        pdfDoc.pipe(fs.createWriteStream(pdfFileName));

        // Ajoutez le contenu du PDF en fonction des informations d'itinéraire
        pdfDoc.text(`Informations d'itinéraire\n\n`);
        pdfDoc.text(`ID: ${itineraireInfo.id}\n`);
        pdfDoc.text(`Nom: ${itineraireInfo.name}\n`);
        pdfDoc.text(`Route: ${itineraireInfo.route}\n`);

        pdfDoc.end();

        const pdfBuffer = await new Promise((resolve, reject) => {
          const chunks = [];
          pdfDoc.on('data', (chunk) => chunks.push(chunk));
          pdfDoc.on('end', () => resolve(Buffer.concat(chunks)));
          pdfDoc.on('error', reject);
      });

      // Envoyer le PDF en tant que binaire via une requête POST
      const response = await fetch(`http://localhost:4000/getFichierPdf/${itineraireInfo.id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/pdf',
        },
          body: pdfBuffer,
      });
        if(response.ok)
        {
          console.log('PDF envoyé avec succès');

          res.status(200).json({ success: true, message: "Informations d'itinéraire et PDF générés avec succès" });
        }
      }

    else {
      console.log('Validation du token échouée');
      res.status(401).send('Validation du token échouée');
    }
    
    }
  catch (error) {
    console.error('Erreur lors de la récupération des informations d\'itinéraire:', error.message);
    res.status(500).send('Erreur lors de la récupération des informations d\'itinéraire');
  }
});


const port=process.env.PORT || 5000;
app.listen(port,()=>{
    console.log("Systéme pdf sur le port 5000");
});