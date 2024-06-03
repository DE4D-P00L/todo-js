window.addEventListener("load", () => {
  const form = document.getElementById("todo-form");
  const priorityCB = document.getElementById("priorityCB");
  const todoList = document.getElementById("todo-list");
  const newTodoInput = document.getElementById("new-todo");

  let todos = getTodosFromStorage();

  todos.forEach(createTodoListItem);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const isHighPriority = priorityCB.checked;
    const newTodoText = newTodoInput.value.trim();
    if (newTodoText) {
      addTodo(newTodoText, isHighPriority);
      newTodoInput.value = "";
      newTodoInput.focus();
      priorityCB.checked = false;
    }
  });

  function getTodosFromStorage() {
    const storedTodos = localStorage.getItem("todos");
    return storedTodos ? JSON.parse(storedTodos) : [];
  }

  function saveTodosToStorage(todos) {
    localStorage.setItem("todos", JSON.stringify(todos));
  }

  function addTodo(text, isHighPriority) {
    const todo = {
      text,
      completed: false,
      isHighPriority,
    };
    todos.push(todo);
    saveTodosToStorage(todos);
    createTodoListItem(todo);
  }

  function createTodoListItem(todo) {
    const listItem = document.createElement("li");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.completed;
    checkbox.addEventListener("change", () => {
      todo.completed = !todo.completed;
      saveTodosToStorage(todos);
      listItem.classList.toggle("completed");
    });

    const label = document.createElement("label");
    label.innerText = todo.text;

    const editBtn = document.createElement("button");
    editBtn.innerHTML = '<i class="fa fa-pencil" aria-hidden="true"></i>';
    editBtn.addEventListener("click", () => {
      const newText = prompt("Enter new text for the task:");
      if (newText) {
        todo.text = newText;
        saveTodosToStorage(todos);
        label.innerText = newText;
      }
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = '<i class="fa fa-trash" aria-hidden="true"></i>';
    deleteBtn.addEventListener("click", () => {
      const index = todos.indexOf(todo);
      todos.splice(index, 1);
      saveTodosToStorage(todos);
      todoList.removeChild(listItem);
    });

    listItem.appendChild(checkbox);
    listItem.appendChild(label);
    listItem.appendChild(editBtn);
    listItem.appendChild(deleteBtn);
    if (todo.isHighPriority) listItem.classList.add("high-priority");
    if (todo.completed) {
      listItem.classList.add("completed");
    }
    todoList.appendChild(listItem);
  }
});
