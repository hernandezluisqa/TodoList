const express = require("express");
const fs = require("fs");
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static("public")); // Servir archivos estáticos

// Leer todos los elementos
app.get("/todos", (req, res) => {
  fs.readFile("todos.json", (err, data) => {
    if (err) throw err;
    res.json(JSON.parse(data));
  });
});

// Crear un nuevo elemento
app.post("/todos", (req, res) => {
  fs.readFile("todos.json", (err, data) => {
    if (err) throw err;
    let todos = JSON.parse(data);
    let newTodo = { id: Date.now(), title: req.body.title, checked: false };
    todos.push(newTodo);
    fs.writeFile("todos.json", JSON.stringify(todos), (err) => {
      if (err) throw err;
      res.json(newTodo);
    });
  });
});

// Actualizar un elemento
app.put("/todos/:id", (req, res) => {
  fs.readFile("todos.json", (err, data) => {
    if (err) throw err;
    let todos = JSON.parse(data);
    let todo = todos.find((t) => t.id == req.params.id);
    if (todo) {
      todo.title = req.body.title;
      todo.checked = req.body.checked;
      fs.writeFile("todos.json", JSON.stringify(todos), (err) => {
        if (err) throw err;
        res.json(todo);
      });
    } else {
      res.status(404).send("Todo not found");
    }
  });
});

// Eliminar un elemento
app.delete("/todos/:id", (req, res) => {
  fs.readFile("todos.json", (err, data) => {
    if (err) throw err;
    let todos = JSON.parse(data);
    todos = todos.filter((t) => t.id != req.params.id);
    fs.writeFile("todos.json", JSON.stringify(todos), (err) => {
      if (err) throw err;
      res.send("Todo deleted");
    });
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
