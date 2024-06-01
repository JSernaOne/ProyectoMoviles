document.addEventListener('init', function(event) {
    var page = event.target;
    if (page.id === "inicio") {
        loadInitialData();
        loadTasks();
        page.querySelector("#add-task-button").onclick = function () {
            showLoadingSpinner();
            setTimeout(() => {
                window.location.href = "/template/add-task.html";
            },1000);
        };
        page.querySelector("#push-button").onclick = function () {
            showLoadingSpinner();
            setTimeout(() => {
                window.location.href = "/template/mapa.html";
            },1000);
        };
        page.querySelector("#edit").onclick = function () {
            showLoadingSpinner();
            setTimeout(() => {
                window.location.href = "/template/edit.html";
            },1000);
        }
        page.querySelector("#volver").onclick = function () {
            showLoadingSpinner();
            setTimeout(() => {
                closeAddTaskPage();
            },1000);
        }
    }
});

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];


function loadInitialData() {
    const userName = "George"; // Este valor se debe obtener de la base de datos
    const motivationalQuote = "El éxito es la suma de pequeños esfuerzos repetidos día tras día."; // Este valor se debe obtener de la base de datos
    const currentDate = new Date().toLocaleDateString();

    document.getElementById('welcome-message').textContent = `Bienvenido ${userName}`;
    document.getElementById('motivational-quote').textContent = motivationalQuote;
    document.getElementById('current-date').textContent = currentDate;
}

function loadTasks() {
    tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    displayTasks();
}

function displayTasks() {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '<ons-list-header>Lista de Tareas</ons-list-header>';
    tasks.forEach((task, index) => {
        const listItem = document.createElement('ons-list-item');
        listItem.innerHTML = `
            <label class="left">
                <ons-checkbox data-index="${index}"></ons-checkbox>
            </label>
            <div class="center">${task.text}</div>
        `;
        taskList.appendChild(listItem);

        const checkbox = listItem.querySelector('ons-checkbox');
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                const index = this.getAttribute('data-index');
                listItem.classList.add('fade-out');
                setTimeout(() => {
                    removeTask(index);
                }, 1000); // Duración igual a la transición CSS
            }
        });
    });
}

function removeTask(index) {
    tasks.splice(index, 1);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    loadTasks();
}

function showLoadingSpinner() {
    const spinner = document.getElementById('loading-spinner');
    spinner.style.display = 'block';
    setTimeout(() => {
        spinner.style.display = 'none';
    },1000);
}

function closeAddTaskPage() {
    window.location.href = "../index.html";
}

