document.addEventListener('deviceready', onDeviceReady, false);
function onDeviceReady() {
    var db = window.sqlitePlugin.openDatabase({name: 'my.db', location: 'default'});

    db.transaction(function(tx) {
        // Crear tabla de usuarios si no existe
        tx.executeSql('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT, username TEXT, password TEXT, phone TEXT)');
    });
}