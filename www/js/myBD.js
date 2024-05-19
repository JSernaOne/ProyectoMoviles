document.addEventListener('deviceready', onDeviceReady, false);

var db = null; // Variable global para la base de datos

function onDeviceReady() {
    db = window.sqlitePlugin.openDatabase({name: 'my.db', location: 'default'});

    db.transaction(function(tx) {
        // Crear tabla de usuarios si no existe
        tx.executeSql('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT, username TEXT, password TEXT, salt TEXT, phone TEXT, idGeo INTEGER, id_lista INTEGER, FOREIGN KEY (idGeo) REFERENCES geolocalizacion(id), FOREIGN KEY (id_lista) REFERENCES lista(id))', [], function(tx, res) {
            console.log('Tabla de usuarios creada exitosamente.');
        }, function(tx, error) {
            console.error('Error al crear la tabla de usuarios: ' + error.message);
        });

    // Agregar columna last_login para guardar la última fecha de inicio de sesión
    // Agregar columna last_login solo si no existe, para evitar errores al ejecutar la aplicación por segunda vez
    // Pragma table_info es una consulta que devuelve información sobre las columnas de una tabla
    tx.executeSql('PRAGMA table_info(users)', [], function(tx, res) {
        var columnExists = false;
        for (var i = 0; i < res.rows.length; i++) {
            if (res.rows.item(i).name === 'last_login') {
                columnExists = true;
                break;
            }
        }
        if (!columnExists) {
            tx.executeSql('ALTER TABLE users ADD COLUMN last_login DATETIME', [], function(tx, res) {
                console.log('Columna last_login agregada exitosamente.');
            }, function(tx, error) {
                console.error('Error al agregar la columna last_login: ' + error.message);
            });
        } else {
            console.log('La columna last_login ya existe en la tabla de usuarios.');
        }
    }, function(tx, error) {
        console.error('Error al verificar la existencia de la columna last_login: ' + error.message);
    });

        // Crear tabla de geolocalización si no existe
        tx.executeSql('CREATE TABLE IF NOT EXISTS geolocalizacion (id INTEGER PRIMARY KEY AUTOINCREMENT, latitude NUMBER, longitude NUMBER, altitude NUMBER, accuracy NUMBER, altitudeAccuracy NUMBER, heading NUMBER, speed NUMBER, timestamp NUMBER)', [], function(tx, res) {
            console.log('Tabla de geolocalizacion creada exitosamente.');
        }, function(tx, error) {
            console.error('Error al crear la tabla de geolocalizacion: ' + error.message);
        });

        // Crear tabla de lista si no existe
        tx.executeSql('CREATE TABLE IF NOT EXISTS lista (id INTEGER PRIMARY KEY AUTOINCREMENT, lista TEXT, fecha DATE, hora TIME, idGeo INTEGER, FOREIGN KEY (idGeo) REFERENCES geolocalizacion(id))', [], function(tx, res) {
            console.log('Tabla de lista creada exitosamente.');
        }, function(tx, error) {
            console.error('Error al crear la tabla de lista: ' + error.message);
        });
    });
}
