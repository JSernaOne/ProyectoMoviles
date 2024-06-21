document.addEventListener("init", function (event) {
  checkAuth()
  var page = event.target;
  if (page.id === "inicio") {
    loadInitialData();
    setupEventHandlers(page);
  }
});

// Mostrar u ocultar la barra de herramientas inferior al desplazarse hacia arriba o hacia abajo
// NO ESTA PROBADO EN EL PROYECTO
document.addEventListener("DOMContentLoaded", function () {
  var lastScrollTop = 0;
  var bottomToolbar = document.querySelector(".bottom-toolbar-container");

  window.addEventListener(
    "scroll",
    function () {
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      if (scrollTop > lastScrollTop) {
        // Scroll down
        bottomToolbar.classList.add("hidden");
      } else {
        // Scroll up
        bottomToolbar.classList.remove("hidden");
      }

      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling
    },
    false
  );
});

async function loadInitialData() {
  try {
    const userName = await getConcurrentUsername(); // Obtener el nombre de usuario del token JWT
    const currentDate = new Date().toLocaleDateString();

    document.getElementById(
      "welcome-message"
    ).textContent = `Bienvenido ${userName}`;
    document.getElementById("current-date").textContent = currentDate;

    // Obtener la frase de la API
    const quote = await fetchMotivationalQuote();
    if (quote) {
      // Mostrar la frase en la página de inicio con el autor en un salto de linea
      document.getElementById(
        "motivational-quote"
      ).textContent = `"${quote.phrase}"`;
      document.getElementById(
        "autor-quote"
      ).textContent = `Autor: ${quote.author}`;
    }
  } catch (error) {
    console.error("Error al cargar los datos iniciales:", error.message);
  }
}

// Obtener la frase del día de la API
async function fetchMotivationalQuote() {
  try {
    const response = await fetch(
      "https://frasedeldia.azurewebsites.net/api/phrase"
    );
    if (!response.ok)
      throw new Error("No se pudo obtener la respuesta de la API de frases");
    return await response.json();
  } catch (error) {
    console.error("Error al obtener la cita:", error.message);
  }
}

// Obtener las tareas del usuario actual
async function displayTasks() {
  try {
    const iduser = await getConcurrentUser();
    const tasks = await getTasksFromDB(iduser);
    const tasksList = document.getElementById("tasks-list");
    tasksList.innerHTML = "";

    tasks.forEach((task) => {
      const taskItem = document.createElement("ons-list-item");
      taskItem.innerHTML = `
        <div class="center">
          <span class="list-item__title">${task.lista}</span>
          <span class="list-item__subtitle">${task.fecha} ${task.hora}</span>
          <span class="list-item__subtitle">Prioridad: ${task.priority}</span>
        </div>
        <div class="right">
          <ons-button class="delete-button" onclick="removeTask(${task.id}, this)">
            <i class="fas fa-trash-alt"></i>
          </ons-button>
        </div>
      `;
      tasksList.appendChild(taskItem);
    });
  } catch (error) {
    console.error("Error al mostrar las tareas:", error.message);
  }
}

// Eliminar una tarea de la base de datos
function setupEventHandlers(page) {
  page.querySelector("#add-task-button").onclick = () =>
    navigateTo("/template/add-task.html");
  page.querySelector("#map").onclick = () => navigateTo("/template/mapa.html");
  page.querySelector("#config").onclick = () =>
    navigateTo("/template/config.html");
  page.querySelector("#volver").onclick = () => {
    logout();
    navigateTo("../index.html", 500);
  };
  page.querySelector("#show-tasks-button").onclick = () => {
    showLoadingSpinner();
    setTimeout(() => {
      displayTasks();
      hideLoadingSpinner();
    }, 200);
  };
}

// Retrasa la navegación a la URL especificada
function navigateTo(url, delay = 1000) {
  showLoadingSpinner();
  setTimeout(() => {
    window.location.href = url;
  }, delay);
}

function showLoadingSpinner() {
  const spinner = document.getElementById("loading-spinner");
  spinner.style.display = "block";
}

function hideLoadingSpinner() {
  const spinner = document.getElementById("loading-spinner");
  spinner.style.display = "none";
}
