document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    var db = window.sqlitePlugin.openDatabase({name: 'my.db', location: 'default'});

    db.transaction(function(tx) {
        // Crear tabla de usuarios si no existe
        tx.executeSql('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT, username TEXT, password TEXT, phone NUMBER, idGeo INTEGER, FOREIGN KEY (idGeo) REFERENCES geolocalizacion(id), FOREIGN KEY (id_lista) REFERENCES lista(id))');
        tx.executeSql('ALTER TABLE users ADD last_login DATETIME;'); // Agregar columna last_login pata guardar la última fecha de inicio de sesión
        tx.executeSql('CREATE TABLE IF NOT EXISTS geolocalizacion (id INTEGER PRIMARY KEY AUTOINCREMENT, latitude NUMBER, longitude NUMBER, altitude NUMBER, accuracy NUMBER, altitudeAccuracy NUMBER, heading NUMBER, speed NUMBER, timestamp NUMBER)');
        tx.executeSql('CREATE TABLE IF NOT EXISTS lista (id INTEGER PRIMARY KEY AUTOINCREMENT, lista TEXT, fecha DATE, hora TIME, idGeo INTEGER, FOREIGN KEY (idGeo) REFERENCES geolocalizacion(id))');
    });
    cosole.log('Base de datos lista');
}