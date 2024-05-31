document.addEventListener('deviceready', onDeviceReady, false);

var db = null; // Variable global para la base de datos

function onDeviceReady() {
    db = window.sqlitePlugin.openDatabase({ name: 'my.db', location: 'default' });

    db.transaction(function(tx) {
        // Crear tabla de usuarios si no existe
        tx.executeSql(`CREATE TABLE IF NOT EXISTS User (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT,
            username TEXT,
            password TEXT,
            salt TEXT,
            phone TEXT,
            status BIT DEFAULT 1,
            show_quote BOOLEAN DEFAULT TRUE, 
            last_login DATETIME DEFAULT NUll,
            sync_status BIT DEFAULT 0, 
            last_sync DATETIME DEFAULT NULL
        )`, [], function(tx, res) {
            console.log('Tabla de usuarios creada exitosamente.');
        }, function(tx, error) {
            console.error('Error al crear la tabla de usuarios: ' + error.message);
        });

        // Crear tabla de geolocalización si no existe
        tx.executeSql(`CREATE TABLE IF NOT EXISTS Geolocalizacion (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            latitude NUMBER,s
            longitude NUMBER,
            sync_status BIT DEFAULT 0, 
            last_sync DATETIME DEFAULT NULL
        )`, [], function(tx, res) {
            console.log('Tabla de geolocalización creada exitosamente.');
        }, function(tx, error) {
            console.error('Error al crear la tabla de geolocalización: ' + error.message);
        });

        // Crear tabla de lista si no existe
        tx.executeSql(`CREATE TABLE IF NOT EXISTS Tareas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            lista TEXT,
            fecha DATE,
            hora TIME,
            priority TEXT,
            idGeo INTEGER,
            iduser INTEGER,
            sync_status BIT DEFAULT 0, 
            last_sync DATETIME DEFAULT NULL,
            estado Bit DEFAULT 1,
            FOREIGN KEY (iduser) REFERENCES User(id),
            FOREIGN KEY (idGeo) REFERENCES Geolocalizacion(id)
        )`, [], function(tx, res) {
            console.log('Tabla de lista creada exitosamente.');
        }, function(tx, error) {
            console.error('Error al crear la tabla de lista: ' + error.message);
        });

        // Crear tabla de frases motivacionales si no existe
        tx.executeSql(`CREATE TABLE IF NOT EXISTS MotivationalQuote (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            quote TEXT,
            author TEXT,
            sync_status BIT DEFAULT 0, 
            last_sync DATETIME DEFAULT NULL
        )`, [], function(tx, res) {
            console.log('Tabla de frases motivacionales creada exitosamente.');
        }, function(tx, error) {
            console.error('Error al crear la tabla de frases motivacionales: ' + error.message);
        });

        // crear tabla de configuración si no existe
        tx.executeSql(`CREATE TABLE IF NOT EXISTS Configuracion (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            show_quote BOOLEAN DEFAULT TRUE,
            foto_perfil TEXT DEFAULT NULL,
            theme TEXT DEFAULT 'light',
            sync_status BIT DEFAULT 0, 
            last_sync DATETIME DEFAULT NULL,
            FOREIGN KEY (user_id) REFERENCES User(id)
        )`, [], function(tx, res) {
            console.log('Tabla de configuración creada exitosamente.');
        }, function(tx, error) {
            console.error('Error al crear la tabla de configuración: ' + error.message);
        });

        // Agregar columna last_login si no existe
        addLastLoginColumn(tx);
    });
}

function addLastLoginColumn(tx) {
    // Verificar la existencia de la columna last_login
    tx.executeSql('PRAGMA table_info(User)', [], function(tx, res) {
        var columnExists = false;
        for (var i = 0; i < res.rows.length; i++) {
            if (res.rows.item(i).name === 'last_login') {
                columnExists = true;
                break;
            }
        }
        if (!columnExists) {
            // Agregar columna last_login
            tx.executeSql('ALTER TABLE User ADD COLUMN last_login DATETIME', [], function(tx, res) {
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
}
