document.addEventListener("deviceready", onDeviceReady, false);

var db = null; // Variable global para la base de datos

function onDeviceReady() {
  db = window.sqlitePlugin.openDatabase({ name: "my.db", location: "default" });

  db.transaction(function (tx) {
    // Crear tabla de usuarios si no existe
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS User (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT UNIQUE,
            username TEXT UNIQUE,
            password TEXT,
            salt TEXT,
            phone TEXT,
            status INTEGER DEFAULT 1,
            last_login TEXT DEFAULT NULL,
            sync_status INTEGER DEFAULT 0, 
            last_sync TEXT DEFAULT NULL
        )`,
      [],
      function (tx, res) {
        console.log("Tabla de usuarios creada exitosamente.");
      },
      function (tx, error) {
        console.error("Error al crear la tabla de usuarios: " + error.message);
      }
    );

    // Crear tabla de geolocalización si no existe
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS Geolocalizacion (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            latitude REAL,
            longitude REAL,
            sync_status INTEGER DEFAULT 0, 
            last_sync TEXT DEFAULT NULL
        )`,
      [],
      function (tx, res) {
        console.log("Tabla de geolocalización creada exitosamente.");
      },
      function (tx, error) {
        console.error(
          "Error al crear la tabla de geolocalización: " + error.message
        );
      }
    );

    // Crear tabla de tareas si no existe
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS Tareas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            lista TEXT,
            fecha TEXT, 
            hora TEXT,
            priority TEXT,
            idGeo INTEGER,
            iduser INTEGER,
            sync_status INTEGER DEFAULT 0, 
            last_sync TEXT DEFAULT NULL,
            estado INTEGER DEFAULT 1,
            FOREIGN KEY (iduser) REFERENCES User(id),
            FOREIGN KEY (idGeo) REFERENCES Geolocalizacion(id)
        )`,
      [],
      function (tx, res) {
        console.log("Tabla de tareas creada exitosamente.");
      },
      function (tx, error) {
        console.error("Error al crear la tabla de tareas: " + error.message);
      }
    );

    // Crear tabla de configuración si no existe
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS Configuracion (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            show_quote INTEGER DEFAULT 1,
            theme TEXT DEFAULT 'light',
            sync_status INTEGER DEFAULT 0, 
            last_sync TEXT DEFAULT NULL,
            FOREIGN KEY (user_id) REFERENCES User(id)
        )`,
      [],
      function (tx, res) {
        console.log("Tabla de configuración creada exitosamente.");
      },
      function (tx, error) {
        console.error(
          "Error al crear la tabla de configuración: " + error.message
        );
      }
    );

    // Agregar columna last_login si no existe
    addLastLoginColumn(tx);

    // Crear índices adicionales si es necesario
    createIndices(tx);
  });
}

function addLastLoginColumn(tx) {
  // Verificar la existencia de la columna last_login
  tx.executeSql(
    "PRAGMA table_info(User)",
    [],
    function (tx, res) {
      var columnExists = false;
      for (var i = 0; i < res.rows.length; i++) {
        if (res.rows.item(i).name === "last_login") {
          columnExists = true;
          break;
        }
      }
      if (!columnExists) {
        // Agregar columna last_login
        tx.executeSql(
          "ALTER TABLE User ADD COLUMN last_login TEXT",  // Usar TEXT para almacenar fecha y hora
          [],
          function (tx, res) {
            console.log("Columna last_login agregada exitosamente.");
          },
          function (tx, error) {
            console.error(
              "Error al agregar la columna last_login: " + error.message
            );
          }
        );
      } else {
        console.log("La columna last_login ya existe en la tabla de usuarios.");
      }
    },
    function (tx, error) {
      console.error(
        "Error al verificar la existencia de la columna last_login: " +
          error.message
      );
    }
  );
}

function createIndices(tx) {
  // Crear índices para mejorar el rendimiento de las consultas
  tx.executeSql(
    `CREATE INDEX IF NOT EXISTS idx_user_email ON User (email)`,
    [],
    function (tx, res) {
      console.log("Índice idx_user_email creado exitosamente.");
    },
    function (tx, error) {
      console.error("Error al crear el índice idx_user_email: " + error.message);
    }
  );

  tx.executeSql(
    `CREATE INDEX IF NOT EXISTS idx_user_username ON User (username)`,
    [],
    function (tx, res) {
      console.log("Índice idx_user_username creado exitosamente.");
    },
    function (tx, error) {
      console.error("Error al crear el índice idx_user_username: " + error.message);
    }
  );

  tx.executeSql(
    `CREATE INDEX IF NOT EXISTS idx_geo_coords ON Geolocalizacion (latitude, longitude)`,
    [],
    function (tx, res) {
      console.log("Índice idx_geo_coords creado exitosamente.");
    },
    function (tx, error) {
      console.error("Error al crear el índice idx_geo_coords: " + error.message);
    }
  );

  tx.executeSql(
    `CREATE INDEX IF NOT EXISTS idx_tareas_user ON Tareas (iduser)`,
    [],
    function (tx, res) {
      console.log("Índice idx_tareas_user creado exitosamente.");
    },
    function (tx, error) {
      console.error("Error al crear el índice idx_tareas_user: " + error.message);
    }
  );

  tx.executeSql(
    `CREATE INDEX IF NOT EXISTS idx_tareas_geo ON Tareas (idGeo)`,
    [],
    function (tx, res) {
      console.log("Índice idx_tareas_geo creado exitosamente.");
    },
    function (tx, error) {
      console.error("Error al crear el índice idx_tareas_geo: " + error.message);
    }
  );
}
