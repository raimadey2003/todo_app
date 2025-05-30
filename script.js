const API_URL = 'http://localhost:3000/api/todos';

async function fetchTodos() {
  const res = await fetch(API_URL);
  let todos = await res.json();

  // Sort todos by time (if time is set), else keep order
  todos.sort((a, b) => {
    if (a.time && b.time) return a.time.localeCompare(b.time);
    if (a.time) return -1;
    if (b.time) return 1;
    return 0;
  });

  const list = document.getElementById('todoList');
  list.innerHTML = '';

  todos.forEach(todo => {
    const li = document.createElement('li');
    li.className = todo.completed ? 'completed' : '';

    // Add color indicators based on time proximity (bonus)
    if (todo.time && !todo.completed) {
      const now = new Date();
      const todoDate = new Date();
      const [hours, minutes] = todo.time.split(':');
      todoDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      const diffMs = todoDate - now;
      const diffMins = diffMs / 60000;

      if (diffMins < 0) {
        li.style.borderColor = '#d9534f'; // red - overdue
      } else if (diffMins <= 30) {
        li.style.borderColor = '#f0ad4e'; // orange - soon
      } else {
        li.style.borderColor = '#5bc0de'; // blue - later
      }
    }

    // Show todo text + time (if any)
    li.innerHTML = `
      <span>${todo.text}${todo.time ? ` ⏰ ${todo.time}` : ''}</span>
      <div>
        <button onclick="toggleComplete(${todo.id}, ${!todo.completed})" aria-label="${todo.completed ? 'Undo task' : 'Mark task done'}">${todo.completed ? 'Undo' : 'Done'}</button>
        <button onclick="deleteTodo(${todo.id})" aria-label="Delete task">Delete</button>
      </div>
    `;

    list.appendChild(li);
  });
}

async function addTodo() {
  const input = document.getElementById('todoInput');
  const timeInput = document.getElementById('todoTime');
  const text = input.value.trim();
  const time = timeInput.value;

  if (!text) return;

  await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, time }),
  });

  input.value = '';
  timeInput.value = '';
  fetchTodos();
}

async function toggleComplete(id, completed) {
  await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed }),
  });
  fetchTodos();
}

async function deleteTodo(id) {
  await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  fetchTodos();
}

// Add task on Enter key press
document.getElementById('todoInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    addTodo();
  }
});

fetchTodos();
