const registerUserCloud = async (user) => {
  try {
    const response = await fetch("http://localhost:3050/api/users/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    if (response.status === 201) {
      ons.notification.alert("Usuario registrado exitosamente");
    } else if (response.status === 409) {
      ons.notification.alert("El usuario ya está registrado");
    } else {
      ons.notification.alert("Error al registrar el usuario");
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

const login = async (user) => {
  try {
    const response = await fetch("http://localhost:3050/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    if (response.status === 200) {
      const data = await response.json();
      // Guardar token y usuario en localStorage para mantener la sesión
      localStorage.setItem("token", data.token);
      //localStorage.setItem("user", JSON.stringify(data.user));

      window.location.href = "/template/home.html";
      return true;
    } else if (response.status === 401) {
      ons.notification.alert("Usuario o contraseña incorrectos");
      return false;
    } else {
      ons.notification.alert("Error al iniciar sesión");
      return false;
    }
  } catch (error) {
    console.error("Error:", error);
    ons.notification.alert("Error de conexión con el servidor");
    return false;
  }
};

const updateUserCloud = async (user) => {
  try {
    const response = await fetch(`http://localhost:3050/api/users/${user.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(user),
    });

    if (response.status === 200) {
      ons.notification.alert("Usuario actualizado exitosamente");
    } else {
      ons.notification.alert("Error al actualizar el usuario");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}
