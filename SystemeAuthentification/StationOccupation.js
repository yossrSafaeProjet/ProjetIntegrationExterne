fetch('https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/velib-disponibilite-en-temps-reel/records?limit=5')
  .then(response => response.json())
  .then(data => {
    if (data && data.results && Array.isArray(data.results)) {
      const stations = data.results.map(record => {
        const stationInfo = {
          name: record.name,
          isInstalled: record.is_installed,
          bikesAvailable: record.numbikesavailable,
          capacity: record.capacity
        };
        return stationInfo;
      });
      console.log(stations);
    } else {
      console.error('La structure des données retournées est incorrecte.');
    }
  })
  .catch(error => {
    console.error('Erreur lors de la récupération des données :', error);
  });
