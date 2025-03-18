// Zarządzanie zadaniami
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let doneTasks = JSON.parse(localStorage.getItem('doneTasks')) || [];
let laterTasks = JSON.parse(localStorage.getItem('laterTasks')) || [];

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('doneTasks', JSON.stringify(doneTasks));
    localStorage.setItem('laterTasks', JSON.stringify(laterTasks));
}

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim();
    if (taskText) {
        tasks.push({ id: Date.now(), text: taskText, description: '', completed: false });
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
            <p>${task.description || 'Brak opisu'}</p>
            <button onclick="showTaskDescription(${task.id})">Opis</button>
            <button onclick="deleteTask(${task.id})">Usuń</button>
        `;
        taskList.appendChild(li);
    });
}

function loadAllTasks() {
    const allTasksList = document.getElementById('allTasks');
    if (!allTasksList) return;
    allTasksList.innerHTML = '';
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${task.text}</span>
            <p>${task.description || 'Brak opisu'}</p>
            <button onclick="markAsDone(${task.id})">Zrobione</button>
            <button onclick="markAsLater(${task.id})">Na Później</button>
        `;
        allTasksList.appendChild(li);
    });
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    loadTasks();
    loadAllTasks();
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
            <p>${task.description || 'Brak opisu'}</p>
            <button onclick="showTaskDescription(${task.id})">Opis</button>
            <button onclick="deleteTask(${task.id})">Usuń</button>
        `;
        taskList.appendChild(li);
    });
}

function markAsDone(id) {
    const task = tasks.find(task => task.id === id);
    if (task) {
        tasks = tasks.filter(task => task.id !== id);
        doneTasks.push(task);
        saveTasks();
        loadTasks();
        loadAllTasks();
        loadColumns();
    }
}

function markAsLater(id) {
    const task = tasks.find(task => task.id === id);
    if (task) {
        tasks = tasks.filter(task => task.id !== id);
        laterTasks.push(task);
        saveTasks();
        loadTasks();
        loadAllTasks();
        loadColumns();
    }
}

function moveToTasks(id, fromList) {
    const task = fromList.find(task => task.id === id);
    if (task) {
        fromList.splice(fromList.indexOf(task), 1); // Usunięcie zadania z odpowiedniej kolumny
        tasks.push(task);
        saveTasks();
        loadTasks();
        loadColumns();
    }
}

function showTaskDescription(id) {
    localStorage.setItem('selectedTaskId', id);
    window.location.href = 'task-description.html';
}

function loadTaskDescription() {
    const taskId = parseInt(localStorage.getItem('selectedTaskId'));
    const task = tasks.find(t => t.id === taskId) || doneTasks.find(t => t.id === taskId) || laterTasks.find(t => t.id === taskId);
    const taskDescription = document.getElementById('taskDetails');
    if (task) {
        taskDescription.innerHTML = `
            <h2>${task.text}</h2>
            <p>${task.description || 'Brak opisu'}</p>
        `;
    } else {
        taskDescription.innerHTML = '<p>Zadanie nie znalezione.</p>';
    }
}

function loadTaskDescriptionPage() {
    const taskId = parseInt(localStorage.getItem('selectedTaskId'));
    const task = tasks.find(t => t.id === taskId) || doneTasks.find(t => t.id === taskId) || laterTasks.find(t => t.id === taskId);
    const taskDescription = document.getElementById('taskDescription');
    if (task) {
        taskDescription.innerHTML = `
            <h2>${task.text}</h2>
            <p>${task.description || 'Brak opisu'}</p>
            <textarea id="descriptionInput">${task.description || ''}</textarea>
            <button onclick="saveTaskDescription(${task.id})">Zapisz opis</button>
        `;
    } else {
        taskDescription.innerHTML = '<p>Zadanie nie znalezione.</p>';
    }
}

function saveTaskDescription(id) {
    const task = tasks.find(task => task.id === id) || doneTasks.find(task => task.id === id) || laterTasks.find(task => task.id === id);
    if (task) {
        const descriptionInput = document.getElementById('descriptionInput').value;
        task.description = descriptionInput;
        saveTasks();
        window.location.href = 'task-details.html';
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

function loadColumns() {
    const currentTasks = document.getElementById('currentTasks').querySelector('ul');
    const doneTasksList = document.getElementById('doneTasks').querySelector('ul');
    const laterTasksList = document.getElementById('laterTasks').querySelector('ul');

    if (!currentTasks || !doneTasksList || !laterTasksList) return;

    currentTasks.innerHTML = '';
    doneTasksList.innerHTML = '';
    laterTasksList.innerHTML = '';

    tasks.forEach(task => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${task.text}</span>
        `;
        currentTasks.appendChild(li);
    });

    doneTasks.forEach(task => {
        const li = document.createElement('li');
        li.classList.add('done');
        li.innerHTML = `
            <span>${task.text}</span>
            <button onclick="moveToTasks(${task.id}, doneTasks)">Przenieś do listy zadań</button>
        `;
        doneTasksList.appendChild(li);
    });

    laterTasks.forEach(task => {
        const li = document.createElement('li');
        li.classList.add('later');
        li.innerHTML = `
            <span>${task.text}</span>
            <button onclick="moveToTasks(${task.id}, laterTasks)">Przenieś do listy zadań</button>
        `;
        laterTasksList.appendChild(li);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    fetch('https://api.adviceslip.com/advice')
        .then(response => response.json())
        .then(data => {
            document.getElementById('advice-text').innerText = data.slip.advice;
        })
        .catch(error => {
            console.error('Error fetching advice:', error);
            document.getElementById('advice-text').innerText = 'Nie udało się pobrać porady.';
        });

    loadTasks();
    loadAllTasks();
    loadColumns();
    if (document.getElementById('taskDetails')) {
        loadTaskDescription();
    }
    if (document.getElementById('taskDescription')) {
        loadTaskDescriptionPage();
    }
});