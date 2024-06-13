const saveUser = async (user) => {
  try {
    const checkUser = await new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT * FROM User WHERE username = ? OR email = ? OR phone = ?",
          [user.username, user.email, user.phone],
          (tx, res) => {
            if (res.rows.length > 0) {
              return resolve(true); // Usuario ya existe
            }
            resolve(false); // Usuario no existe
          },
          (tx, error) => {
            reject(new Error("Error verificando usuario: " + error.message));
          }
        );
      });
    });

    if (checkUser) {
      return ons.notification.alert(
        "El username, email o teléfono ya están registrados."
      );
    }

    await new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          "INSERT INTO User (name, email, username, password, salt, phone) VALUES (?, ?, ?, ?, ?, ?)",
          [
            user.name,
            user.email,
            user.username,
            user.password,
            user.salt,
            user.phone,
          ],
          (tx, res) => {
            console.log("Usuario registrado exitosamente.");
            registerUserCloud(user);
            resolve();
          },
          (tx, error) => {
            reject(new Error("Error registrando usuario: " + error.message));
          }
        );
      });
    });

  } catch (error) {
    ons.notification.alert(error.message);
  }
};

const updateUser = async (user) => {
  try {
    await new Promise((resolve, reject) => {
      const token = localStorage.getItem("token");
      db.transaction((tx) => {
        tx.executeSql(
          "UPDATE User SET name = ?, username = ?, phone = ? WHERE id = ?",
          [user.name, user.username, user.phone, token.id],
          (tx, res) => {
            console.log("Usuario actualizado exitosamente.");
            //updateUserCloud(user);
            resolve();
          },
          (tx, error) => {
            reject(new Error("Error actualizando usuario: " + error.message));
          }
        );
      });
    });

  } catch (error) {
    ons.notification.alert(error.message);
  }
}

// obtener a id del usuario con inicio de sesión JWT
const getConcurrentUser = async () => {
  return new Promise((resolve, reject) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return reject("No hay un token de inicio de sesión.");
    }

    try {
      const payload = jwt_decode(token);
      resolve(parseInt(payload.id)); // Asegúrate de que el ID se convierta a un número entero en base 10
    } catch (error) {
      reject(new Error("Error decodificando el token: " + error.message));
    }
  });
};

// obtener el username del usuario con inicio de sesión JWT
const getConcurrentUsername = async () => {
  return new Promise((resolve, reject) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return reject("No hay un token de inicio de sesión.");
    }

    try {
      const payload = jwt_decode(token);
      resolve(payload.username);
    } catch (error) {
      reject(new Error("Error decodificando el token: " + error.message));
    }
  });
};


