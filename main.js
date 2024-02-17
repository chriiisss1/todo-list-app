const addTasksForm = document.querySelector('.add-tasks-form');
const addTasksInput = document.querySelector('.add-task-input');
const addTasksButton = document.querySelector('.add-task-arrow-up-icon');
const tasksContainer = document.querySelector('.tasks-container');
const markedTasksContainer = document.querySelector('.marked-tasks-container');
const mainTasksContainer = document.querySelector('.main-tasks-container');
const noTasksContainer = document.querySelector('.no-tasks-container');
const themeButton = document.querySelector('.heading-moon-icon');

const handleThemeButton = () => {
  document.body.classList.toggle('dark-theme');
  const getCurrentTheme = () => (document.body.classList.contains('dark-theme') ? true : false);
  localStorage.setItem('dark-theme', getCurrentTheme() ? true : false);
  themeButton.textContent = getCurrentTheme() ? 'light_mode' : 'dark_mode';
};

const handleSubmitTask = (e) => {
  e.preventDefault();

  if (addTasksInput.value.trim() !== '') {
    addTask(addTasksInput.value.trim());
  }
};

const handleSubmitStateButton = () => {
  if (addTasksInput.value.trim() !== '') {
    addTasksButton.classList.add('arrow-up-enable');
  } else {
    addTasksButton.classList.remove('arrow-up-enable');
  }
};

const toggleMaincontainerGap = () => {
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
  const tasks = JSON.parse(localStorage.getItem('tasks'));

  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const milliseconds = String(date.getMilliseconds()).padStart(3, '0');

  const taskDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}`;

  const newTask = {
    task: inputValue,
    taskDate,
    marked: false,
  };

  tasks.push(newTask);

  localStorage.setItem('tasks', JSON.stringify(tasks));

  if (tasks.length >= 1) deleteNoTasksText();

  addTasksInput.value = '';

  addTasksButton.classList.remove('arrow-up-enable');

  renderTasks(tasks);
};

const renderTasks = (tasks) => {
  sortedTasks(tasks);

  const tasksHTML = tasks
    .map((task) => {
      return `
      <div class="task">
        <div class="left-side">
        <span class="task-circle-icon material-symbols-outlined">
          circle
        </span>
          <input type="text" class="task-input" spellcheck="false" value="${task.task}">
        </div>
        <span class="task-trash-icon material-symbols-outlined">
          close
        </span>
      </div>`;
    })
    .join('');

  tasksContainer.innerHTML = tasksHTML;

  const taskInput = document.querySelectorAll('.task-input');
  const taskCircleIcon = document.querySelectorAll('.task-circle-icon');
  const taskTrashIcon = document.querySelectorAll('.task-trash-icon');

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
  taskCircleIcon.forEach((element, i) => {
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
  taskTrashIcon.forEach((element, i) => {
    element.addEventListener('click', () => {
      const tasks = JSON.parse(localStorage.getItem('tasks'));
      const markedTasks = JSON.parse(localStorage.getItem('markedTasks'));
      sortedTasks(tasks);
      tasks.splice(i, 1);
      localStorage.setItem('tasks', JSON.stringify(tasks));
      if (markedTasks.length === 0 && tasks.length === 0) renderNoTasksText();
      renderTasks(tasks);
    });
  });

  toggleMaincontainerGap();
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
  const markedTasks = JSON.parse(localStorage.getItem('markedTasks'));

  sortedTasks(tasks);

  let task = tasks[i];
  task.marked = true;

  markedTasks.unshift(task);
  localStorage.setItem('markedTasks', JSON.stringify(markedTasks));

  tasks.splice(i, 1);
  localStorage.setItem('tasks', JSON.stringify(tasks));

  renderMarkedTasks(markedTasks);
  renderTasks(tasks);
};

const renderMarkedTasks = (markedTasks) => {
  const markedTasksHTML = markedTasks
    .map((markedTasks) => {
      return `
      <div class="marked-task">
        <div class="left-side">
        <span class="marked-task-circle-icon material-symbols-outlined">
          check_circle
        </span>
          <input type="text" class="task-input" readonly spellcheck="false" value="${markedTasks.task}">
        </div>
        <span class="marked-task-trash-icon material-symbols-outlined">
          close
        </span>
        
      </div>`;
    })
    .join('');

  markedTasksContainer.innerHTML = markedTasksHTML;

  const markedTaskTrashIcon = document.querySelectorAll('.marked-task-trash-icon');
  const markedTaskICircleIcon = document.querySelectorAll('.marked-task-circle-icon');

  // Delete marked task
  markedTaskTrashIcon.forEach((element, i) => {
    element.addEventListener('click', () => {
      const tasks = JSON.parse(localStorage.getItem('tasks'));
      const markedTasks = JSON.parse(localStorage.getItem('markedTasks'));
      markedTasks.splice(i, 1);
      localStorage.setItem('markedTasks', JSON.stringify(markedTasks));
      if (markedTasks.length === 0 && tasks.length === 0) renderNoTasksText();
      renderMarkedTasks(markedTasks);
    });
  });

  // Return task
  markedTaskICircleIcon.forEach((element, i) => {
    element.addEventListener('click', () => {
      returnMarkedTask(i);
    });
  });

  toggleMaincontainerGap();
};

const returnMarkedTask = (i) => {
  const markedTasks = JSON.parse(localStorage.getItem('markedTasks'));
  const tasks = JSON.parse(localStorage.getItem('tasks'));

  let markedTask = markedTasks[i];

  markedTask.marked = false;

  tasks.push(markedTask);
  localStorage.setItem('tasks', JSON.stringify(tasks));

  markedTasks.splice(i, 1);
  localStorage.setItem('markedTasks', JSON.stringify(markedTasks));

  renderTasks(tasks);
  renderMarkedTasks(markedTasks);
};

const renderNoTasksText = () => {
  const text = `
  <h1 class="no-tasks-text">
    No tasks :D
  </h1>
  `;

  noTasksContainer.innerHTML = text;
};

const deleteNoTasksText = () => {
  const noTasksText = document.querySelector('.no-tasks-text');

  if (noTasksText) noTasksText.remove();
};

const onLoadPage = () => {
  const darkTheme = localStorage.getItem('dark-theme');
  const tasks = JSON.parse(localStorage.getItem('tasks'));
  const markedTasks = JSON.parse(localStorage.getItem('markedTasks'));

  addTasksInput.value = '';

  if (tasks === null) renderNoTasksText();

  if (tasks === null) localStorage.setItem('tasks', JSON.stringify([]));

  if (markedTasks === null) localStorage.setItem('markedTasks', JSON.stringify([]));

  if (darkTheme === 'true') {
    document.body.classList.add('dark-theme');
    themeButton.textContent = 'light_mode';
  } else {
    document.body.classList.remove('dark-theme');
    themeButton.textContent = 'dark_mode';
  }

  const getTasks = () => {
    let tasks = JSON.parse(localStorage.getItem('tasks'));
    const markedTasks = JSON.parse(localStorage.getItem('markedTasks'));

    if (tasks.length === 0 && markedTasks === 0) return renderNoTasksText();

    tasks = tasks.filter((element) => element.task.length > 0);

    tasks.forEach((element) => (element.task = element.task.trim()));

    localStorage.setItem('tasks', JSON.stringify(tasks));

    renderTasks(tasks);
  };

  const getMarkedTask = () => {
    const markedTasks = JSON.parse(localStorage.getItem('markedTasks'));

    renderMarkedTasks(markedTasks);
  };

  getTasks();

  getMarkedTask();
};

onLoadPage();

addTasksForm.addEventListener('submit', handleSubmitTask);
addTasksInput.addEventListener('input', handleSubmitStateButton);
themeButton.addEventListener('click', handleThemeButton);
