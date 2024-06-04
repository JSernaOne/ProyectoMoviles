
// end point para guardar la geolocalizacion en la nube
const saveGeolocalizacionCloude = async (geolocalizacion) => {
    const validarToken = localStorage.getItem('token');
  try {
    const response = await fetch("http://localhost:3050/api/geolo/saveGeolo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${validarToken}`,
      },
      body: JSON.stringify(geolocalizacion),
    });
    if (response.status === 200) {
      console.log("Geolocalización guardada exitosamente en la nube.");
    } else {
      console.error(
        "Falló al guardar la geolocalización en la nube:",
        response.statusText
      );
    }
  } catch (error) {
    console.error(
      "Falló al guardar la geolocalización en la nube:",
      error.message
    );
  }
};
