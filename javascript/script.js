const todos = [];
const RENDER_EVENT = "render-todo";
let isCompleted = false;
let keyword = "";

const SAVED_EVENT = "saved-todo";
const STORAGE_KEY = "TODO_APPS";

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(todos);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const todo of data) {
      todos.push(todo);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("form");
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addTodo();
  });
  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

const checkTodo = document.getElementById("readClear");
checkTodo.addEventListener("change", checkBoxTodo);

const search = document.getElementById("search");
search.addEventListener("change", (e) => {
  keyword = e.target.value;
  document.dispatchEvent(new Event(RENDER_EVENT));
});

function addTodo() {
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const year = document.getElementById("tahun").value;

  const generatedID = generateId();
  const todoObject = generateTodoObject(
    generatedID,
    title,
    author,
    year,
    isCompleted
  );
  todos.push(todoObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
  isCompleted = false;
  checkTodo.checked = false;
}

function generateId() {
  return +new Date();
}

function generateTodoObject(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author,
    year,
    isCompleted,
  };
}

document.addEventListener(RENDER_EVENT, function () {
  const uncompletedTODOList = document.getElementById("todos");
  uncompletedTODOList.innerHTML = "";

  const completedTODOList = document.getElementById("completed-todos");
  completedTODOList.innerHTML = "";

  for (const todoItem of todos.filter(({ title }) =>
    title.toLowerCase().includes(keyword.toLowerCase())
  )) {
    const todoElement = makeTodo(todoItem);
    if (!todoItem.isCompleted) uncompletedTODOList.append(todoElement);
    else completedTODOList.append(todoElement);
  }
});
function makeTodo(todoObject) {
  const titleText = document.createElement("h2");
  titleText.innerText = "Judul Buku : " + todoObject.title;

  const authorText = document.createElement("p");
  authorText.innerText = "Penulis : " + todoObject.author;

  const yearNumber = document.createElement("p");
  yearNumber.innerText = "Tahun Terbit : " + todoObject.year;

  const textContainer = document.createElement("div");
  textContainer.classList.add("inner");
  textContainer.append(titleText, authorText, yearNumber);

  const container = document.createElement("div");
  container.classList.add("item", "shadow");
  container.append(textContainer);
  container.setAttribute("id", `todo-${todoObject.id}`);

  if (todoObject.isCompleted) {
    const undoButton = document.createElement("button");
    undoButton.innerText = "Buku Belum Dibaca";
    undoButton.classList.add("undo-button");

    undoButton.addEventListener("click", function () {
      undoTaskFromCompleted(todoObject.id);
    });

    const trashButton = document.createElement("button");
    trashButton.innerText = "Hapus Buku";
    trashButton.classList.add("trash-button");

    trashButton.addEventListener("click", function () {
      removeTaskFromCompleted(todoObject.id);
    });

    container.append(undoButton, trashButton);
  } else {
    const checkButton = document.createElement("button");
    checkButton.innerText = "Buku Sudah Dibaca";
    checkButton.classList.add("check-button");

    checkButton.addEventListener("click", function () {
      addTaskToCompleted(todoObject.id);
    });

    const trashButton = document.createElement("button");
    trashButton.innerText = "Hapus Buku";
    trashButton.classList.add("trash-button");

    trashButton.addEventListener("click", function () {
      removeTaskFromCompleted(todoObject.id);
    });

    container.append(checkButton, trashButton);
  }

  return container;
}

function checkBoxTodo(e) {
  isCompleted = e.target.checked;
}

function findTodo(todoId) {
  for (const todoItem of todos) {
    if (todoItem.id === todoId) {
      return todoItem;
    }
  }
  return null;
}
function findTodoIndex(todoId) {
  for (const index in todos) {
    if (todos[index].id === todoId) {
      return index;
    }
  }

  return -1;
}
function addTaskToCompleted(todoId) {
  const todoTarget = findTodo(todoId);

  if (todoTarget == null) return;

  todoTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function removeTaskFromCompleted(todoId) {
  const todoTarget = findTodoIndex(todoId);

  if (todoTarget === -1) return;

  todos.splice(todoTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function undoTaskFromCompleted(todoId) {
  const todoTarget = findTodo(todoId);

  if (todoTarget == null) return;

  todoTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}
