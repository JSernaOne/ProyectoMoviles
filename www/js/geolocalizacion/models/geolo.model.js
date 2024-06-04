
// guardar geolocalizacion en la base de datos 
const saveGeolocalizacion = async (geolocalizacion) => {
    db.transaction(function(tx) {
        tx.executeSql(
            `INSERT INTO Geolocalizacion (latitude, longitude) VALUES (?, ?)`,
            [geolocalizacion.latitude, geolocalizacion.longitude],
            function(tx, res) {
                console.log('Geolocalización guardada exitosamente.');
                saveGeolocalizacionCloude(geolocalizacion);
            },
            function(tx, error) {
                console.error('Error al guardar la geolocalización: ' + error.message);
            }
        );
    });
};

// obtener el id de la geolocalizacion guardada
const getGeolocalizacionId = async (geolocalizacion) => {
    return new Promise((resolve, reject) => {
        db.transaction(function(tx) {
            tx.executeSql(
                `SELECT id FROM Geolocalizacion WHERE latitude = ? AND longitude = ?`,
                [geolocalizacion.latitude, geolocalizacion.longitude],
                function(tx, res) {
                    const id = res.rows[0].id;
                    resolve(parseInt(id, 10));
                },
                function(tx, error) {
                    console.error('Error al obtener la geolocalización: ' + error.message);
                    reject(error);
                }
            );
        });
    });
}

// obtener geolocalizacion de la base de datos
const getGeolocalizacion = async () => {
    return new Promise((resolve, reject) => {
        db.transaction(function(tx) {
            tx.executeSql(
                `SELECT * FROM Geolocalizacion`,
                [],
                function(tx, res) {
                    resolve(res.rows);
                },
                function(tx, error) {
                    console.error('Error al obtener la geolocalización: ' + error.message);
                    reject(error);
                }
            );
        });
    });
};