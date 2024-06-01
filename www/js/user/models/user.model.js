const saveUser = async (user) => {
   db.transaction((tx) => {
    tx.executeSql(
      "SELECT * FROM User WHERE username = ? OR email = ? OR phone = ?",
      [user.username, user.email, user.phone],
      (tx, res) => {
        if (res.rows.length > 0) {
          return ons.notification.alert(
            "El username, email o teléfono ya están registrados."
          );
        }

        tx.executeSql(
          "INSERT INTO User (name, email, username, password, salt, phone) VALUES (?, ?, ?, ?, ?, ?)",
          [user.name, user.email, user.username, user.password, user.salt, user.phone],
          (tx, res) => {
            console.log("Usuario registrado exitosamente.");
            registerUserCloud(user);
          },
          (tx, error) => {
            ons.notification.alert(
              "Error registrando usuario: " + error.message
            );
          }
        );
      },
      (tx, error) => {
        ons.notification.alert("Error verificando usuario: " + error.message);
      }
    );
  });
};

