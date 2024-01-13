const addTasksForm = document.querySelector('.add-tasks-form');
const addTasksInput = document.querySelector('.add-task-input');
const addTasksButton = document.querySelector('.add-task-icon-arrow-up');
const tasksContainer = document.querySelector('.tasks-container');
const markedTasksContainer = document.querySelector('.marked-tasks-container');
const mainTasksContainer = document.querySelector('.main-tasks-container');
const noTasksContainer = document.querySelector('.no-tasks-container');

const handleSubmitTask = (e) => {
  e.preventDefault();

  if (addTasksInput.value.trim() !== '') {
    addTask(addTasksInput.value.trim());
  }
};

const handleVisibilityButton = () => {
  if (addTasksInput.value.trim() !== '') {
    addTasksButton.classList.add('active-icon');
  } else {
    addTasksButton.classList.remove('active-icon');
  }
};

const clearInputValue = () => {
  addTasksInput.value = '';
};

const removeMaincontainerGap = () => {
  const tasks = JSON.parse(localStorage.getItem('tasks'));
  const markedTasks = JSON.parse(localStorage.getItem('markedTasks'));

  if (tasks && markedTasks) {
    if (tasks.length > 0 && markedTasks.length > 0) {
      mainTasksContainer.style.rowGap = '26.8px';
    } else {
      mainTasksContainer.style.rowGap = '0px';
    }
  }
};

const addTask = (inputValue) => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const milliseconds = String(date.getMilliseconds()).padStart(3, '0');

  const taskDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}`;

  if (localStorage.getItem('tasks') === null) {
    const tasks = [];

    const newTask = {
      task: inputValue,
      taskDate,
      marked: false,
    };

    tasks.push(newTask);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    if (tasks.length >= 1) removeNoTasksText();
    addTasksInput.value = '';
    addTasksButton.classList.remove('active-icon');
    renderTasks(tasks);
  } else {
    const tasks = JSON.parse(localStorage.getItem('tasks'));

    const newTask = {
      task: inputValue,
      taskDate,
      marked: false,
    };

    tasks.push(newTask);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    if (tasks.length >= 1) removeNoTasksText();
    addTasksInput.value = '';
    addTasksButton.classList.remove('active-icon');
    renderTasks(tasks);
  }
};

const renderTasks = (tasks) => {
  sortedTasks(tasks);

  const tasksHTML = tasks
    .map((task) => {
      return `
      <div class="task">
        <div class="left-side">
          <svg class="task-icon-circle" width="18" height="18" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.877075 7.49991C0.877075 3.84222 3.84222 0.877075 7.49991 0.877075C11.1576 0.877075 14.1227 3.84222 14.1227 7.49991C14.1227 11.1576 11.1576 14.1227 7.49991 14.1227C3.84222 14.1227 0.877075 11.1576 0.877075 7.49991ZM7.49991 1.82708C4.36689 1.82708 1.82708 4.36689 1.82708 7.49991C1.82708 10.6329 4.36689 13.1727 7.49991 13.1727C10.6329 13.1727 13.1727 10.6329 13.1727 7.49991C13.1727 4.36689 10.6329 1.82708 7.49991 1.82708Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
          <input type="text" class="task-input" spellcheck="false" value="${task.task}">
        </div>
        <svg class="task-icon-trash" width="18" height="18" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.5 1C5.22386 1 5 1.22386 5 1.5C5 1.77614 5.22386 2 5.5 2H9.5C9.77614 2 10 1.77614 10 1.5C10 1.22386 9.77614 1 9.5 1H5.5ZM3 3.5C3 3.22386 3.22386 3 3.5 3H5H10H11.5C11.7761 3 12 3.22386 12 3.5C12 3.77614 11.7761 4 11.5 4H11V12C11 12.5523 10.5523 13 10 13H5C4.44772 13 4 12.5523 4 12V4L3.5 4C3.22386 4 3 3.77614 3 3.5ZM5 4H10V12H5V4Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>        </div>
      </div>`;
    })
    .join('');

  tasksContainer.innerHTML = tasksHTML;

  const taskInput = document.querySelectorAll('.task-input');
  const taskIconCircle = document.querySelectorAll('.task-icon-circle');
  const taskIconTrash = document.querySelectorAll('.task-icon-trash');

  // Update task in local storage
  taskInput.forEach((element, i) => {
    element.addEventListener('input', (e) => {
      const tasks = JSON.parse(localStorage.getItem('tasks'));
      sortedTasks(tasks);

      const taskInputValue = e.target.value;

      tasks[i].task = taskInputValue;
      localStorage.setItem('tasks', JSON.stringify(tasks));
    });
  });

  // Move to marked tasks
  taskIconCircle.forEach((element, i) => {
    element.addEventListener('click', () => {
      const tasks = JSON.parse(localStorage.getItem('tasks'));
      sortedTasks(tasks);
      const task = tasks[i];

      if (task.task == '') {
        return;
      } else {
        addMarkedTask(i);
      }
    });
  });

  // Delete task
  taskIconTrash.forEach((element, i) => {
    element.addEventListener('click', () => {
      const tasks = JSON.parse(localStorage.getItem('tasks'));
      sortedTasks(tasks);
      tasks.splice(i, 1);
      localStorage.setItem('tasks', JSON.stringify(tasks));
      if (tasks.length === 0) renderNoTasksText();
      renderTasks(tasks);
    });
  });

  removeMaincontainerGap();
};

const sortedTasks = (tasks) => {
  tasks.sort((a, b) => {
    const dateA = new Date(a.taskDate);
    const dateB = new Date(b.taskDate);
    return dateB - dateA;
  });
};

const addMarkedTask = (i) => {
  const tasks = JSON.parse(localStorage.getItem('tasks'));
  sortedTasks(tasks);

  let task = tasks[i];

  task.marked = true;

  if (localStorage.getItem('markedTasks') === null) {
    const markedTasks = [];

    markedTasks.unshift(task);
    localStorage.setItem('markedTasks', JSON.stringify(markedTasks));
    renderMarkedTasks(markedTasks);

    tasks.splice(i, 1);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks(tasks);
  } else {
    const markedTasks = JSON.parse(localStorage.getItem('markedTasks'));

    markedTasks.unshift(task);
    localStorage.setItem('markedTasks', JSON.stringify(markedTasks));
    renderMarkedTasks(markedTasks);

    tasks.splice(i, 1);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks(tasks);
  }
};

const renderMarkedTasks = (markedTasks) => {
  const markedTasksHTML = markedTasks
    .map((markedTasks) => {
      return `
      <div class="marked-task">
        <div class="left-side">
          <svg class="marked-task-icon-circle width="18" height="18" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.49991 0.877045C3.84222 0.877045 0.877075 3.84219 0.877075 7.49988C0.877075 11.1575 3.84222 14.1227 7.49991 14.1227C11.1576 14.1227 14.1227 11.1575 14.1227 7.49988C14.1227 3.84219 11.1576 0.877045 7.49991 0.877045ZM1.82708 7.49988C1.82708 4.36686 4.36689 1.82704 7.49991 1.82704C10.6329 1.82704 13.1727 4.36686 13.1727 7.49988C13.1727 10.6329 10.6329 13.1727 7.49991 13.1727C4.36689 13.1727 1.82708 10.6329 1.82708 7.49988ZM10.1589 5.53774C10.3178 5.31191 10.2636 5.00001 10.0378 4.84109C9.81194 4.68217 9.50004 4.73642 9.34112 4.96225L6.51977 8.97154L5.35681 7.78706C5.16334 7.59002 4.84677 7.58711 4.64973 7.78058C4.45268 7.97404 4.44978 8.29061 4.64325 8.48765L6.22658 10.1003C6.33054 10.2062 6.47617 10.2604 6.62407 10.2483C6.77197 10.2363 6.90686 10.1591 6.99226 10.0377L10.1589 5.53774Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
          <input type="text" class="task-input" readonly spellcheck="false" value="${markedTasks.task}">
        </div>
        <svg class="marked-task-icon-trash" width="18" height="18" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.5 1C5.22386 1 5 1.22386 5 1.5C5 1.77614 5.22386 2 5.5 2H9.5C9.77614 2 10 1.77614 10 1.5C10 1.22386 9.77614 1 9.5 1H5.5ZM3 3.5C3 3.22386 3.22386 3 3.5 3H5H10H11.5C11.7761 3 12 3.22386 12 3.5C12 3.77614 11.7761 4 11.5 4H11V12C11 12.5523 10.5523 13 10 13H5C4.44772 13 4 12.5523 4 12V4L3.5 4C3.22386 4 3 3.77614 3 3.5ZM5 4H10V12H5V4Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
      </div>`;
    })
    .join('');

  markedTasksContainer.innerHTML = markedTasksHTML;

  const markedTaskIconTrash = document.querySelectorAll('.marked-task-icon-trash');
  const markedTaskIconCircle = document.querySelectorAll('.marked-task-icon-circle');

  // Delete marked tasks
  markedTaskIconTrash.forEach((element, i) => {
    element.addEventListener('click', () => {
      const markedTasks = JSON.parse(localStorage.getItem('markedTasks'));
      markedTasks.splice(i, 1);
      localStorage.setItem('markedTasks', JSON.stringify(markedTasks));
      if (markedTasks.length === 0) renderNoTasksText();
      renderMarkedTasks(markedTasks);
    });
  });

  // Return tasks
  markedTaskIconCircle.forEach((element, i) => {
    element.addEventListener('click', () => {
      returnMarkedTasks(i);
    });
  });

  removeMaincontainerGap();
};

const returnMarkedTasks = (i) => {
  const markedTasks = JSON.parse(localStorage.getItem('markedTasks'));
  let markedTask = markedTasks[i];

  markedTask.marked = false;

  if (localStorage.getItem('tasks') === null) {
    const tasks = [];
    tasks.push(markedTask);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks(tasks);

    const markedTasks = JSON.parse(localStorage.getItem('markedTasks'));
    markedTasks.splice(i, 1);
    localStorage.setItem('markedTasks', JSON.stringify(markedTasks));
    renderMarkedTasks(markedTasks);
  } else {
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks.push(markedTask);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks(tasks);

    const markedTasks = JSON.parse(localStorage.getItem('markedTasks'));
    markedTasks.splice(i, 1);
    localStorage.setItem('markedTasks', JSON.stringify(markedTasks));
    renderMarkedTasks(markedTasks);
  }
};

const renderNoTasksText = () => {
  const text = `
  <h1 class="no-tasks-text">
    No tasks :D
  </h1>
  `;

  noTasksContainer.innerHTML = text;
};

const removeNoTasksText = () => {
  const noTasksText = document.querySelector('.no-tasks-text');

  if (noTasksText) noTasksText.remove();
};

const getTasks = () => {
  let tasks = JSON.parse(localStorage.getItem('tasks'));

  if (tasks === null) renderNoTasksText();

  if (tasks) {
    tasks = tasks.filter((element) => element.task.length > 0);
    tasks.forEach((element) => (element.task = element.task.trim()));

    if (tasks.length === 0) {
      renderNoTasksText();
    }

    localStorage.setItem('tasks', JSON.stringify(tasks));

    renderTasks(tasks);
  }
};

const getMarkedTask = () => {
  const markedTasks = JSON.parse(localStorage.getItem('markedTasks'));
  if (markedTasks) {
    if (markedTasks.length >= 1) removeNoTasksText();

    renderMarkedTasks(markedTasks);
  }
};

clearInputValue();

getTasks();

getMarkedTask();

addTasksForm.addEventListener('submit', handleSubmitTask);

addTasksInput.addEventListener('input', handleVisibilityButton);
