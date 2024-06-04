document.addEventListener("init", function (event) {
  var page = event.target;
  if (page.id === "inicio") {
    loadInitialData();
    page.querySelector("#add-task-button").onclick = function () {
      showLoadingSpinner();
      setTimeout(() => {
        window.location.href = "/template/add-task.html";
      }, 1000);
    };
    page.querySelector("#push-button").onclick = function () {
      showLoadingSpinner();
      setTimeout(() => {
        window.location.href = "/template/mapa.html";
      }, 1000);
    };
    page.querySelector("#edit").onclick = function () {
      showLoadingSpinner();
      setTimeout(() => {
        window.location.href = "/template/edit.html";
      }, 1000);
    };
    page.querySelector("#volver").onclick = function () {
      showLoadingSpinner();
      setTimeout(() => {
        // Digirirse al inicio
        window.location.href = "../index.html";
      }, 500);
    };
    page.querySelector("#show-tasks-button").onclick = function () {
      showLoadingSpinner();
      setTimeout(() => {
        displayTasks();
      }, 200);
    }
  }
});

function loadInitialData() {
  const userName = "George"; // Este valor se debe obtener de la base de datos
  const motivationalQuote =
    "El éxito es la suma de pequeños esfuerzos repetidos día tras día."; // Este valor se debe obtener de la base de datos
  const currentDate = new Date().toLocaleDateString();

  document.getElementById(
    "welcome-message"
  ).textContent = `Bienvenido ${userName}`;
  document.getElementById("motivational-quote").textContent = motivationalQuote;
  document.getElementById("current-date").textContent = currentDate;
}

const displayTasks = async () => {
  db.transaction(function (tx) {
    tx.executeSql(
      `SELECT * FROM Tareas`,
      [],
      function (tx, results) {
        const tasksList = document.getElementById("tasks-list");
        tasksList.innerHTML = ""; // Limpiar la lista de tareas

        for (let i = 0; i < results.rows.length; i++) {
          const task = results.rows.item(i);
          const taskItem = document.createElement("ons-list-item");
          taskItem.innerHTML = `
            <div class="center">
              <span class="list-item__title">${task.lista}</span>
              <span class="list-item__subtitle">${task.fecha} - ${task.hora}</span>
            </div>
            <div class="right">
              <ons-icon icon="md-delete" onclick="removeTask(${task.id})"></ons-icon>
            </div>
          `;
          taskItem.addEventListener("click", function () {
            removeTask(task.id, taskItem);
          });

          tasksList.appendChild(taskItem);
        }
      },
      function (tx, error) {
        console.error("Error al obtener las tareas: " + error.message);
      }
    );
  });
};

function showLoadingSpinner() {
  const spinner = document.getElementById("loading-spinner");
  spinner.style.display = "block";
  setTimeout(() => {
    spinner.style.display = "none";
  }, 1000);
}
