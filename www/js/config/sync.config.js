// Función que obtiene los registros de la BD local y los retorna al servidor
const syncLocalToServer = async () => {
  try {
    const localData = await fetchUnsyncedData();
    const response = await fetch(
      "http://localhost:3050/api/sync/syncFromLocal",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(localData),
      }
    );
    if (response.status === 200) {
      console.log("Datos sincronizados exitosamente al servidor.");
      await markDataAsSynced(localData.user); // Marcar datos como sincronizados en la base de datos local
    } else {
      console.error(
        "Falló la sincronización al servidor:",
        response.statusText
      );
    }
  } catch (error) {
    console.error("Falló la sincronización al servidor:", error.message);
  }
};

const markDataAsSynced = async (users) => {
  db.transaction((tx) => {
    users.forEach((user) => {
      tx.executeSql("UPDATE User SET sync_status = 1 WHERE id = ?", [user.id]);
    });
  });
};

// Función para obtener datos de la base de datos local y enviarlos al servidor
const fetchUnsyncedData = async () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM User WHERE sync_status = 0",
        [],
        (tx, results) => {
          const users = [];
          for (let i = 0; i < results.rows.length; i++) {
            users.push(results.rows.item(i));
            // modificar el estado y la fecha de sincronización
          }
          resolve({ user: users });
        },
        (error) => {
          reject(error);
        }
      );
    });
  });
};

// Función para descargar datos actualizados del servidor
const syncFromServer = async () => {
  try {
    const response = await fetch("http://localhost:3050/api/sync/syncToLocal", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      const serverData = await response.json(); // Convertir la respuesta a JSON
      updateLocalDatabase(serverData);
    } else {
      console.error("Failed to fetch data from server:", response.statusText);
    }
  } catch (error) {
    console.error("Failed to fetch data from server:", error.message);
  }
};

const updateLocalDatabase = async (serverData) => {
  const { user } = serverData;
  db.transaction(function (tx) {
    user.forEach((u) => {
      tx.executeSql(
        "INSERT OR REPLACE INTO User (id, name, email, username, password, salt, phone, status, show_quote, last_login, sync_status, last_sync) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          u.id,
          u.name,
          u.email,
          u.username,
          u.password,
          u.salt,
          u.phone,
          u.status,
          u.show_quote,
          u.last_login,
          u.sync_status,
          u.last_sync,
        ]
      );
    });
  });
};
