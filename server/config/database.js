// BD Mysql para sincronización en la nube
// Crear base de datos en MySQL con el siguiente script:
// Configuración de la conexión a la base de datos MySQL
import { createConnection } from "mysql";

const connection = createConnection({
  host: "localhost", // Dirección del host de tu base de datos MySQL
  user: "root", // Nombre de usuario de tu base de datos MySQL
  password: "root", // Contraseña de tu base de datos MySQL
  database: "gestionTareas", // Nombre de tu base de datos MySQL
});

// Conexión a la base de datos MySQL
connection.connect((error) => {
  if (error) {
    console.error("Error de conexión a la base de datos:", error);
  } else {
    console.log("Conexión exitosa a la base de datos MySQL");
  }
});

export default connection;

// Crear tabla de Usuarios
connection.query(
  `CREATE TABLE IF NOT EXISTS User (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255),
    username VARCHAR(255),
    password VARCHAR(255),
    salt VARCHAR(255),
    phone VARCHAR(20),
    status TINYINT DEFAULT 1,
    show_quote BOOLEAN DEFAULT TRUE, 
    last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    sync_status VARCHAR(20) DEFAULT 'pending', 
    last_sync TIMESTAMP DEFAULT NULL
);
)`,
  (error) => {
    if (error) {
      console.error("Error al crear la tabla de usuarios:", error);
    } else {
      console.log("Tabla de usuarios creada exitosamente");
    }
  }
);

// Crear tabla de Geolocalización
connection.query(
  `CREATE TABLE IF NOT EXISTS Geolocalizacion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    altitude DECIMAL(10, 8),
    accuracy DECIMAL(10, 8),
    altitudeAccuracy DECIMAL(10, 8),
    heading DECIMAL(10, 8),
    speed DECIMAL(10, 8),
    timestamp INT,
    sync_status VARCHAR(20) DEFAULT 'pending',
    last_sync TIMESTAMP DEFAULT NULL
);
)`,
  (error) => {
    if (error) {
      console.error("Error al crear la tabla de geolocalización:", error);
    } else {
      console.log("Tabla de geolocalización creada exitosamente");
    }
  }
);
// Crear tabla de Tareas
connection.query(
  `CREATE TABLE IF NOT EXISTS Tareas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lista TEXT,
    fecha DATE,
    hora TIME,
    priority VARCHAR(20),
    idGeo INT,
    iduser INT,
    sync_status VARCHAR(20) DEFAULT 'pending',
    last_sync TIMESTAMP DEFAULT NULL,
    estado BIT DEFAULT 0,
    FOREIGN KEY (iduser) REFERENCES User(id),
    FOREIGN KEY (idGeo) REFERENCES Geolocalizacion(id)
);
)`,
  (error) => {
    if (error) {
      console.error("Error al crear la tabla de lista:", error);
    } else {
      console.log("Tabla de lista creada exitosamente");
    }
  }
);
//Crear tabla de frases motivacionales
connection.query(
  `CREATE TABLE IF NOT EXISTS MotivationalQuote (
    id INT AUTO_INCREMENT PRIMARY KEY,
    quote TEXT,
    author TEXT,
    sync_status VARCHAR(20) DEFAULT 'pending',
    last_sync TIMESTAMP DEFAULT NULL
);
)`,
  (error) => {
    if (error) {
      console.error("Error al crear la tabla de frases motivacionales:", error);
    } else {
      console.log("Tabla de frases motivacionales creada exitosamente");
    }
  }
);
// Crear tabla de configuración
connection.query(
  `CREATE TABLE IF NOT EXISTS Configuration (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    show_quote BOOLEAN DEFAULT TRUE,
    theme VARCHAR(20) DEFAULT 'light',
    sync_status VARCHAR(20) DEFAULT 'pending',
    last_sync TIMESTAMP DEFAULT NULL,
    FOREIGN KEY (user_id) REFERENCES User(id)
);
)`,
  (error) => {
    if (error) {
      console.error("Error al crear la tabla de configuración:", error);
    } else {
      console.log("Tabla de configuración creada exitosamente");
    }
  }
);