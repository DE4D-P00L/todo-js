window.addEventListener("load", () => {
  const form = document.getElementById("todo-form");
  const priorityCB = document.getElementById("priorityCB");
  const todoList = document.getElementById("todo-list");
  const newTodoInput = document.getElementById("new-todo");
  const hCountSpan = document.getElementById("hCountSpan");

  let todos = getTodosFromStorage();
  let hCount = todos?.filter((todo) => todo.isHighPriority).length;

  function refreshHCount() {
    hCountSpan.innerText = todos?.filter((todo) => todo.isHighPriority).length;
  }

  hCountSpan.innerText = hCount;

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
    refreshHCount();
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
    editBtn.innerHTML =
      '<img src="./assets/icons8-edit-24.png" class="icon edit" alt="" />';
    // editBtn.innerHTML = '<i class="fa fa-pencil" aria-hidden="true"></i>';
    editBtn.addEventListener("click", () => {
      const newText = prompt("Enter new text for the task:");
      if (newText) {
        todo.text = newText;
        saveTodosToStorage(todos);
        label.innerText = newText;
      }
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML =
      '<img src="./assets/icons8-delete-24.png" class="icon delete" alt="" />';
    // deleteBtn.innerHTML = '<i class="fa fa-trash" aria-hidden="true"></i>';
    const deleteText = document.createElement("p");
    deleteText.className = "Text";
    deleteText.innerText = "DELETE";
    deleteBtn.appendChild(deleteText);
    deleteBtn.addEventListener("click", () => {
      const index = todos.indexOf(todo);
      todos.splice(index, 1);
      saveTodosToStorage(todos);
      todoList.removeChild(listItem);
      refreshHCount();
    });

    const cbContainer = document.createElement("div");
    cbContainer.className = "cbContainer";
    cbContainer.appendChild(checkbox);
    cbContainer.appendChild(label);
    // listItem.appendChild(checkbox);
    // listItem.appendChild(label);
    listItem.appendChild(cbContainer);

    const btnContainer = document.createElement("div");
    btnContainer.className = "btnContainer";
    btnContainer.appendChild(editBtn);
    const editText = document.createElement("p");
    editText.className = "Text";
    editText.innerText = "EDIT";
    editBtn.appendChild(editText);
    editBtn.className = "btn";
    deleteBtn.className = "btn";
    btnContainer.appendChild(deleteBtn);
    // listItem.appendChild(editBtn);
    // listItem.appendChild(deleteBtn);
    listItem.appendChild(btnContainer);
    if (todo.isHighPriority) {
      listItem.classList.add("high-priority");
      hCount++;
    }
    if (todo.completed) {
      listItem.classList.add("completed");
    }
    todoList.appendChild(listItem);
  }
});
