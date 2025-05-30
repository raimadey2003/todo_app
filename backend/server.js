const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

let todos = [];
let id = 0;

app.use(cors());
app.use(bodyParser.json());

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../frontend')));

// API Routes
app.get('/api/todos', (req, res) => {
  res.json(todos);
});

app.post('/api/todos', (req, res) => {
  const newTodo = {
    id: id++,
    text: req.body.text,
    completed: false,
    time: req.body.time || null  // <-- added time support here
  };
  todos.push(newTodo);
  res.json(newTodo);
});

app.put('/api/todos/:id', (req, res) => {
  const todo = todos.find(t => t.id == req.params.id);
  if (todo) {
    todo.text = req.body.text ?? todo.text;
    todo.completed = req.body.completed ?? todo.completed;
    todo.time = req.body.time ?? todo.time;  // <-- allow updating time too
    res.json(todo);
  } else {
    res.status(404).send('Todo not found');
  }
});

app.delete('/api/todos/:id', (req, res) => {
  todos = todos.filter(t => t.id != req.params.id);
  res.sendStatus(204);
});

// Serve index.html for unmatched routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
