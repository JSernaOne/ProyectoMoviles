// Registrar usuario
const registerUser = async (name, username, email, password, phone) => {
  if (!validateFields([name, username, email, password, phone])) {
    return ons.notification.alert("Por favor complete todos los campos.");
  }
  if (!validateName(name)) {
    return ons.notification.alert("El nombre solo debe contener letras.");
  }
  if (!validateEmail(email)) {
    return ons.notification.alert("Por favor ingrese un email válido.");
  }
  if (!validatePhone(phone)) {
    return ons.notification.alert(
      "El teléfono solo debe contener números y máximo 10 dígitos."
    );
  }

  const salt = generateSalt();
  const hashedPassword = await hashPassword(password, salt);

  saveUser({
    name: name,
    username: username,
    email: email,
    password: hashedPassword,
    salt: salt,
    phone: phone,
  });
};
// generar salt aleatorio para la contraseña
const generateSalt = () => {
  // Generar una cadena de sal aleatoria, por ejemplo
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

const hashPassword = (password, salt) => {
  // Concatenar la contraseña y la sal
  const passwordWithSalt = password + salt;

  // Aplicar un algoritmo de hash a la contraseña + sal
  const hashedPassword = sha256(passwordWithSalt);

  return hashedPassword;
};

/**
 *
 *
 * Fución que no se utilizara en el despliegue de la aplicación
 *
 *
 */
// ver usuarios
const viewUsers = async () => {
  db.transaction(function (tx) {
    tx.executeSql("SELECT * FROM User", [], function (tx, res) {
      const users = document.getElementById("users-list");
      var items = users.querySelectorAll("ons-list-item");
      items.forEach(function (item) {
        item.remove();
      });
      for (var i = 0; i < res.rows.length; i++) {
        var user = res.rows.item(i);
        var item = document.createElement("ons-list-item");
        item.innerHTML = "Username: " + user.name + " - Correo: " + user.email;
        users.appendChild(item);
      }
    });
  });
};

// iniciar sesión
const loginUser = async (email, password) => {
  if (!validateFields([email, password])) {
    ons.notification.alert("Por favor complete todos los campos.");
    return;
  }

  db.transaction(function (tx) {
    tx.executeSql(
      "SELECT id, salt, password FROM User WHERE email = ?",
      [email],
      async function (tx, res) {
        if (res.rows.length > 0) {
          let id = res.rows.item(0).id;
          let salt = res.rows.item(0).salt;
          let hashedPassword = hashPassword(password, salt);
          let storedPassword = res.rows.item(0).password;

          if (hashedPassword === storedPassword) {
            // Credenciales locales válidas, proceder a validar en la nube
            const loginJson = {
              email: email,
              password: hashedPassword,
            };

            const loginSuccess = await login(loginJson);
            if (loginSuccess) {
              updateLastLogin(id);
            } else {
              ons.notification.alert("Error al iniciar sesión en la nube.");
            }
          } else {
            ons.notification.alert("Contraseña incorrecta.");
          }
        } else {
          ons.notification.alert("Usuario no encontrado.");
        }
      },
      function (tx, error) {
        ons.notification.alert("Error al iniciar sesión: " + error.message);
      }
    );
  });
};

// actualizar last_login
//aspectos a tener en cuenta en la función updateLastLogin no esta funcionando correctamente
//se debe de revisar la función para que pueda funcionar correctamente
const updateLastLogin = (id) => {
  let syncTime = getCurrentDateTime();
  db.transaction(function (tx) {
    tx.executeSql(
      "UPDATE User SET last_login = ? WHERE id = ?",
      [syncTime, id],
      function (tx, res) {
        console.log("last_login actualizado.");
      },
      function (tx, error) {
        ons.notification.alert(
          "Error actualizando last_login: " + error.message
        );
      }
    );
  });
};

// Validar campos del formulario
const validateFields = (fields) => {
  return fields.every((field) => field.trim() !== "");
};

// validar nombres de usuario
// Sin simbolos especiales, ni numros
// Solo letras
/*^ indica que el patrón debe iniciar con los caracteres dentro de los corchetes
  [A-Z] indica que los caracteres admitidos son letras del alfabeto
  + indica que los caracteres dentro de los corchetes se pueden repetir
  $ indica que el patrón finaliza con los caracteres que están dentro de los corchetes.
  i indica que validaremos letras mayúsculas y minúsculas (case-insensitive)*/
const validateName = (name) => {
  const pattern = /^[A-Z]+$/i; // Expresión regular para validar solo letras en mayúsculas y minúsculas
  return pattern.test(name);
};

const validateEmail = (email) => {
  const pattern = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/; // Expresión regular para validar un email
  return pattern.test(email);
};

//validar numero de telefono
const validatePhone = (phone) => {
  if (phone.length < 10) {
    return false;
  }
  const pattern = /^[0-9]+$/; // Expresión regular para validar solo números
  return pattern.test(phone);
};

// evento de inicialización de la aplicación con Onsen UI para cargar las páginas de la aplicación
document.addEventListener("init", function (event) {
  var page = event.target; // Página actual cargada

  // Página de inicio
  if (page.id === "inicio") {
    page.querySelector("#push-registro").onclick = function () {
      document
        .querySelector("#myNavigator")
        .pushPage("registro.html", { data: { title: "Registro" } });
    };
    page.querySelector("#login-button").onclick = function () {
      (email = page.querySelector("#email").value),
        (password = page.querySelector("#password").value);
      loginUser(email, password);
    };
    page.querySelector("#show-users").onclick = function () {
      viewUsers();
    };

    // Página de registro
  } else if (page.id === "registro") {
    page.querySelector("ons-toolbar .center").innerHTML = page.data.title;
    page.querySelector("#registro-button").onclick = function () {
      registerUser(
        page.querySelector("#nombre").value,
        page.querySelector("#username_register").value,
        page.querySelector("#correo").value,
        page.querySelector("#contrasena").value,
        page.querySelector("#telefono").value
      );
    };
  }
});
