// Zarządzanie zadaniami
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim();
    if (taskText) {
        tasks.push({ id: Date.now(), text: taskText, completed: false });
        taskInput.value = '';
        saveTasks();
        loadTasks();
    }
}

function loadTasks() {
    const taskList = document.getElementById('taskList');
    if (!taskList) return;
    taskList.innerHTML = '';
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${task.text}</span>
            <button onclick="showTaskDetails(${task.id})">Szczegóły</button>
            <button onclick="deleteTask(${task.id})">Usuń</button>
        `;
        taskList.appendChild(li);
    });
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    loadTasks();
}

function filterTasks() {
    const filterInput = document.getElementById('filterInput').value.toLowerCase();
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    const filteredTasks = tasks.filter(task => task.text.toLowerCase().includes(filterInput));
    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${task.text}</span>
            <button onclick="showTaskDetails(${task.id})">Szczegóły</button>
            <button onclick="deleteTask(${task.id})">Usuń</button>
        `;
        taskList.appendChild(li);
    });
}

function showTaskDetails(id) {
    localStorage.setItem('selectedTaskId', id);
    window.location.href = 'task-details.html';
}

function loadTaskDetails() {
    const taskId = parseInt(localStorage.getItem('selectedTaskId'));
    const task = tasks.find(t => t.id === taskId);
    const taskDetails = document.getElementById('taskDetails');
    if (task) {
        taskDetails.innerHTML = `
            <h2>${task.text}</h2>
            <p>Status: ${task.completed ? 'Zakończone' : 'Niezakończone'}</p>
        `;
    } else {
        taskDetails.innerHTML = '<p>Zadanie nie znalezione.</p>';
    }
}

// Pobieranie porady z API
async function fetchAdvice() {
    const adviceDiv = document.getElementById('advice');
    if (!adviceDiv) return;
    try {
        const response = await fetch('https://api.adviceslip.com/advice');
        const data = await response.json();
        adviceDiv.innerHTML = `<p><strong>Porada dnia:</strong> ${data.slip.advice}</p>`;
    } catch (error) {
        adviceDiv.innerHTML = '<p>Błąd podczas pobierania porady.</p>';
    }
}