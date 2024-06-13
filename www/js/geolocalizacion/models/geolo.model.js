// guardar geolocalizacion en la base de datos
const saveGeolocalizacion = async (geolocalizacion) => {
  try {
    await new Promise((resolve, reject) => {
      db.transaction(function (tx) {
        tx.executeSql(
          `INSERT INTO Geolocalizacion (latitude, longitude) VALUES (?, ?)`,
          [geolocalizacion.latitude, geolocalizacion.longitude],
          function (tx, res) {
            console.log("Geolocalización guardada exitosamente.");
            saveGeolocalizacionCloude(geolocalizacion);
            resolve();
          },
          function (tx, error) {
            console.error(
              "Error al guardar la geolocalización: " + error.message
            );
            reject(error);
          }
        );
      });
    });
  } catch (error) {
    console.error(
      "Error en la operación de guardado de geolocalización:",
      error.message
    );
  }
};

// obtener el id de la geolocalizacion guardada
const getGeolocalizacionId = async (geolocalizacion) => {
  return new Promise((resolve, reject) => {
    db.transaction(function (tx) {
      tx.executeSql(
        `SELECT id FROM Geolocalizacion WHERE latitude = ? AND longitude = ?`,
        [geolocalizacion.latitude, geolocalizacion.longitude],
        function (tx, res) {
          if (res.rows.length > 0) {
            const id = res.rows.item(0).id;
            resolve(parseInt(id));
          } else {
            reject(new Error("Geolocalización no encontrada."));
          }
        },
        function (tx, error) {
          console.error(
            "Error al obtener la geolocalización: " + error.message
          );
          reject(error);
        }
      );
    });
  });
};

// obtener geolocalizacion de la base de datos
const getGeolocalizacion = async () => {
  return new Promise((resolve, reject) => {
    db.transaction(function (tx) {
      tx.executeSql(
        `SELECT * FROM Geolocalizacion`,
        [],
        function (tx, res) {
          const geolocalizaciones = [];
          for (let i = 0; i < res.rows.length; i++) {
            geolocalizaciones.push(res.rows.item(i));
          }
          resolve(geolocalizaciones);
        },
        function (tx, error) {
          console.error(
            "Error al obtener la geolocalización: " + error.message
          );
          reject(error);
        }
      );
    });
  });
};
