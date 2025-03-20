document.addEventListener("DOMContentLoaded", getTodos);

function getTodos() {
  fetch("/todos")
    .then((response) => response.json())
    .then((data) => {
      const ul = document.getElementById("myUL");
      ul.innerHTML = "";
      data.forEach((todo) => {
        const li = document.createElement("li");
        li.textContent = todo.title;
        li.id = todo.id;
        if (todo.checked) {
          li.classList.add("checked");
        }
        ul.appendChild(li);
        addCloseButton(li);
      });
    })
    .catch((error) => console.error("Error fetching todos:", error));
}

function newElement() {
  const inputValue = document.getElementById("myInput").value;
  if (inputValue === "") {
    alert("You must write something!");
    return;
  }

  fetch("/todos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: inputValue }),
  })
    .then((response) => response.json())
    .then((todo) => {
      const ul = document.getElementById("myUL");
      const li = document.createElement("li");
      li.textContent = todo.title;
      li.id = todo.id;
      ul.appendChild(li);
      addCloseButton(li);
    })
    .catch((error) => console.error("Error adding todo:", error));

  document.getElementById("myInput").value = "";
}

function addCloseButton(li) {
  const span = document.createElement("SPAN");
  const txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  li.appendChild(span);

  span.onclick = function () {
    fetch(`/todos/${li.id}`, { method: "DELETE" })
      .then(() => {
        li.style.display = "none";
      })
      .catch((error) => console.error("Error deleting todo:", error));
  };

  li.onclick = function () {
    fetch(`/todos/${li.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: li.textContent,
        checked: !li.classList.contains("checked"),
      }),
    })
      .then((response) => response.json())
      .then((todo) => {
        li.classList.toggle("checked");
      })
      .catch((error) => console.error("Error updating todo:", error));
  };
}
