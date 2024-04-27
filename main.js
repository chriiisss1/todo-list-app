const mainWrapper = document.querySelector('.todo-list');
const addTaskForm = document.querySelector('.todo-list-add-task-form');
const addTaskInput = document.querySelector('.todo-list-add-task-form-input');
const addTaskButton = document.querySelector('.todo-list-add-task-form-arrow-up-icon');
const tasksWrapper = document.querySelector('.todo-list-tasks-wrapper');
const markedTasksWrapper = document.querySelector('.todo-list-marked-tasks-wrapper');
const mainTasksWrapper = document.querySelector('.todo-list-main-tasks-wrapper');
const noTasksWrapper = document.querySelector('.todo-list-no-tasks-wrapper');
const themeButton = document.querySelector('.todo-list-header-moon-icon-wrapper');

var sunSvgIcon =
  '<svg class="todo-list-header-sun-icon" xmlns="http://www.w3.org/2000/svg" height="22" viewBox="0 -960 960 960" width="22"><path d="M480-360q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35Zm0 59.999q-74.922 0-127.461-52.538Q300.001-405.078 300.001-480t52.538-127.461Q405.078-659.999 480-659.999t127.461 52.538Q659.999-554.922 659.999-480t-52.538 127.461Q554.922-300.001 480-300.001Zm-280-150H50v-59.998h150v59.998Zm709.999 0H760v-59.998h149.999v59.998ZM450.001-760v-149.999h59.998V-760h-59.998Zm0 710v-150h59.998v150h-59.998ZM262.924-656.925l-93.692-90.461 42.383-44.383 90.231 92.692-38.922 42.152Zm485.461 488.692-90.846-93.307 39.537-41.537 93.692 90.461-42.383 44.383Zm-91.461-528.844 90.461-93.692 44.383 42.383-92.692 90.231-42.152-38.922ZM168.232-211.615l93.307-90.846 40.768 39.537-90.076 94.077-43.999-42.768ZM480-480Z"/></svg>';

var moonSvgIcon =
  '<svg class="todo-list-header-moon-icon" xmlns="http://www.w3.org/2000/svg" height="22" viewBox="0 -960 960 960" width="22"><path d="M481.154-140.001q-141.666 0-240.832-99.167Q141.155-338.334 141.155-480q0-135.768 92.115-232.883 92.114-97.115 225.575-105.192 8.615 0 16.922.615t16.307 1.846q-30.615 28.615-48.768 69.153-18.154 40.539-18.154 86.461 0 98.334 68.834 167.168 68.834 68.833 167.168 68.833 46.538 0 86.768-18.153 40.23-18.153 68.461-48.768 1.231 8 1.846 16.307.616 8.307.616 16.922-7.693 133.461-104.808 225.575-97.115 92.115-232.883 92.115Zm0-59.999q88 0 158-48.5t102-126.5q-20 5-40 8t-40 3q-123 0-209.5-86.5t-86.5-209.5q0-20 3-40t8-40q-78 32-126.5 102t-48.5 158q0 116 82 198t198 82Zm-10-270Z"/></svg>';

const handleThemeButton = () => {
  document.body.classList.toggle('dark-theme');
  const getCurrentTheme = () => (document.body.classList.contains('dark-theme') ? true : false);
  localStorage.setItem('dark-theme', getCurrentTheme() ? true : false);
  themeButton.innerHTML = getCurrentTheme() ? `${sunSvgIcon}` : `${moonSvgIcon}`;
};

const handleSubmitTask = (e) => {
  e.preventDefault();

  if (addTaskInput.value.trim() !== '') {
    addTask(addTaskInput.value.trim());
  }
};

const handleSubmitStateButton = () => {
  if (addTaskInput.value.trim() !== '') {
    addTaskButton.classList.add('todo-list-add-task-form-arrow-up-enable');
  } else {
    addTaskButton.classList.remove('todo-list-add-task-form-arrow-up-enable');
  }
};

const toggleMaincontainerGap = () => {
  const tasks = JSON.parse(localStorage.getItem('tasks'));
  const markedTasks = JSON.parse(localStorage.getItem('markedTasks'));

  if (tasks && markedTasks) {
    if (tasks.length > 0 && markedTasks.length > 0) {
      mainTasksWrapper.style.rowGap = '26px';
    } else {
      mainTasksWrapper.style.rowGap = '0px';
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

  addTaskInput.value = '';

  addTaskButton.classList.remove('todo-list-add-task-form-arrow-up-enable');

  renderTasks(tasks);
};

const renderTasks = (tasks) => {
  sortedTasks(tasks);

  const tasksHTML = tasks
    .map((task) => {
      return `
      <div class="todo-list-task">
        <div class="todo-list-task-left-side">
          <svg class="todo-list-task-circle-icon" xmlns="http://www.w3.org/2000/svg" height="22" viewBox="0 -960 960 960" width="22">
            <path
              d="M480.067-100.001q-78.836 0-148.204-29.92-69.369-29.92-120.682-81.21-51.314-51.291-81.247-120.629-29.933-69.337-29.933-148.173t29.92-148.204q29.92-69.369 81.21-120.682 51.291-51.314 120.629-81.247 69.337-29.933 148.173-29.933t148.204 29.92q69.369 29.92 120.682 81.21 51.314 51.291 81.247 120.629 29.933 69.337 29.933 148.173t-29.92 148.204q-29.92 69.369-81.21 120.682-51.291 51.314-120.629 81.247-69.337 29.933-148.173 29.933ZM480-160q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
          </svg>
          <input type="text" class="todo-list-task-input" spellcheck="false" value="${task.task}">
        </div>
        <div class="todo-list-task-input-shadow"></div>
        <svg class="todo-list-task-trash-icon" xmlns="http://www.w3.org/2000/svg" height="22" viewBox="0 -960 960 960" width="22">
          <path
          d="M256-213.847 213.847-256l224-224-224-224L256-746.153l224 224 224-224L746.153-704l-224 224 224 224L704-213.847l-224-224-224 224Z" />
        </svg>
      </div>`;
    })
    .join('');

  tasksWrapper.innerHTML = tasksHTML;

  const tasksInput = document.querySelectorAll('.todo-list-task-input');
  const tasksCircleIcon = document.querySelectorAll('.todo-list-task-circle-icon');
  const tasksTrashIcon = document.querySelectorAll('.todo-list-task-trash-icon');
  const tasksInputShadow = document.querySelectorAll('.todo-list-task-input-shadow');
  const markedTasks = JSON.parse(localStorage.getItem('markedTasks'));
  let inputOnFocus;

  if (markedTasks.length === 0 && tasks.length === 0) renderNoTasksText();

  if (markedTasks.length <= 1) {
    if (tasks.length < 2) deleteDeleteAllText();
  }

  if (tasks.length > 1) renderDeleteAllText();

  if (tasks.length === 1 && markedTasks.length === 1) renderDeleteAllText();

  const DeleteAllTasks = () => {
    const deleteAllText = document.querySelector('.todo-list-delete-all');

    if (deleteAllText) {
      deleteAllText.addEventListener('click', () => {
        localStorage.setItem('tasks', JSON.stringify([]));
        localStorage.setItem('markedTasks', JSON.stringify([]));

        const tasks = JSON.parse(localStorage.getItem('tasks'));
        const markedTasks = JSON.parse(localStorage.getItem('markedTasks'));

        renderTasks(tasks);
        renderMarkedTasks(markedTasks);
        renderNoTasksText();
        deleteDeleteAllText();
      });
    }
  };

  DeleteAllTasks();

  tasksInput.forEach((element, i) => {
    // Añadir borde cuando se hace click en una tarea
    element.addEventListener('focus', () => {
      element.style.outline = '2px solid var(--gray-100)';
      tasksInputShadow[i].style.display = 'none';
      inputOnFocus = true;
    });

    // Ocultar sombra de input cuando el scroll llega al final
    element.addEventListener('scroll', () => {
      let scrollLeft = element.scrollLeft;
      const scrollWidth = element.scrollWidth;
      const clientWidth = element.clientWidth;

      let redondeadoArriba = Math.ceil(scrollLeft);

      if (redondeadoArriba + clientWidth >= scrollWidth) {
        tasksInputShadow[i].style.display = 'none';
        // Solo si no esta en foco y aun no llega al final
      } else if (redondeadoArriba + clientWidth <= scrollWidth && !inputOnFocus) {
        tasksInputShadow[i].style.display = 'block';
      }
    });

    // Quitar borde cuando se hace click fuera de una tarea
    element.addEventListener('blur', () => {
      element.style.outline = '0px transparent';
      tasksInputShadow[i].style.display = 'block';
      inputOnFocus = false;
    });
  });

  // Edit task in local storage
  tasksInput.forEach((element, i) => {
    element.addEventListener('input', (e) => {
      const tasks = JSON.parse(localStorage.getItem('tasks'));
      sortedTasks(tasks);

      const taskInputValue = e.target.value;

      tasks[i].task = taskInputValue;
      localStorage.setItem('tasks', JSON.stringify(tasks));
    });
  });

  // Move to marked tasks
  tasksCircleIcon.forEach((element, i) => {
    element.addEventListener('click', () => {
      const tasks = JSON.parse(localStorage.getItem('tasks'));
      sortedTasks(tasks);
      const task = tasks[i];

      if (task.task == '') {
        return;
      } else {
        MoveMarkedTask(i);
      }
    });
  });

  // Delete task
  tasksTrashIcon.forEach((element, i) => {
    element.addEventListener('click', () => {
      const tasks = JSON.parse(localStorage.getItem('tasks'));
      sortedTasks(tasks);
      tasks.splice(i, 1);
      localStorage.setItem('tasks', JSON.stringify(tasks));
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

const MoveMarkedTask = (i) => {
  const tasks = JSON.parse(localStorage.getItem('tasks'));
  const markedTasks = JSON.parse(localStorage.getItem('markedTasks'));

  sortedTasks(tasks);

  let task = tasks[i];
  task.marked = true;
  task.task = task.task.trim();

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
      <div class="todo-list-marked-task">
        <div class="todo-list-marked-task-left-side">
          <svg class="todo-list-marked-task-circle-icon" xmlns="http://www.w3.org/2000/svg" height="22" viewBox="0 -960 960 960" width="22">
            <path
              d="m423.231-309.847 268.922-268.922L650-620.922 423.231-394.153l-114-114L267.078-466l156.153 156.153Zm56.836 209.846q-78.836 0-148.204-29.92-69.369-29.92-120.682-81.21-51.314-51.291-81.247-120.629-29.933-69.337-29.933-148.173t29.92-148.204q29.92-69.369 81.21-120.682 51.291-51.314 120.629-81.247 69.337-29.933 148.173-29.933t148.204 29.92q69.369 29.92 120.682 81.21 51.314 51.291 81.247 120.629 29.933 69.337 29.933 148.173t-29.92 148.204q-29.92 69.369-81.21 120.682-51.291 51.314-120.629 81.247-69.337 29.933-148.173 29.933ZM480-160q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
          </svg>
          <input type="text" class="todo-list-marked-task-input" readonly spellcheck="false" value="${markedTasks.task}">
        </div>
        <div class="todo-list-marked-task-input-shadow"></div>
        <svg class="todo-list-marked-task-trash-icon" xmlns="http://www.w3.org/2000/svg" height="22" viewBox="0 -960 960 960" width="22">
          <path
            d="M256-213.847 213.847-256l224-224-224-224L256-746.153l224 224 224-224L746.153-704l-224 224 224 224L704-213.847l-224-224-224 224Z" />
        </svg>
      </div>`;
    })
    .join('');

  markedTasksWrapper.innerHTML = markedTasksHTML;

  const markedTasksInputShadow = document.querySelectorAll('.todo-list-marked-task-input-shadow');
  const markedTasksInput = document.querySelectorAll('.todo-list-marked-task-input');
  const markedTasksTrashIcon = document.querySelectorAll('.todo-list-marked-task-trash-icon');
  const markedTasksCircleIcon = document.querySelectorAll('.todo-list-marked-task-circle-icon');
  const tasks = JSON.parse(localStorage.getItem('tasks'));

  if (markedTasks.length === 0 && tasks.length === 0) renderNoTasksText();

  if (tasks.length <= 1) {
    if (markedTasks.length < 2) deleteDeleteAllText();
  }

  if (markedTasks.length > 1) renderDeleteAllText();

  if (tasks.length === 1 && markedTasks.length === 1) renderDeleteAllText();

  markedTasksInput.forEach((element, i) => {
    element.addEventListener('scroll', () => {
      let scrollLeft = element.scrollLeft;
      const scrollWidth = element.scrollWidth;
      const clientWidth = element.clientWidth;

      let redondeadoArriba = Math.ceil(scrollLeft);

      if (redondeadoArriba + clientWidth >= scrollWidth) {
        markedTasksInputShadow[i].style.display = 'none';
      } else if (redondeadoArriba + clientWidth <= scrollWidth) {
        markedTasksInputShadow[i].style.display = 'block';
      }
    });
  });

  // Delete marked task
  markedTasksTrashIcon.forEach((element, i) => {
    element.addEventListener('click', () => {
      const markedTasks = JSON.parse(localStorage.getItem('markedTasks'));
      markedTasks.splice(i, 1);
      localStorage.setItem('markedTasks', JSON.stringify(markedTasks));
      renderMarkedTasks(markedTasks);
    });
  });

  // Return task
  markedTasksCircleIcon.forEach((element, i) => {
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
  const noTasksText = document.querySelector('.todo-list-no-tasks-text');

  if (!noTasksText) {
    let noTasksTextDiv = document.createElement('div');

    noTasksTextDiv.classList.add('todo-list-no-tasks-text');
    noTasksTextDiv.textContent = 'No tasks';

    noTasksWrapper.appendChild(noTasksTextDiv);
  }
};

const deleteNoTasksText = () => {
  const noTasksText = document.querySelector('.todo-list-no-tasks-text');

  if (noTasksText) noTasksText.remove();
};

const renderDeleteAllText = () => {
  const deleteAll = document.querySelector('.todo-list-delete-all');

  if (!deleteAll) {
    let deleteAllDiv = document.createElement('div');

    deleteAllDiv.classList.add('todo-list-delete-all');
    deleteAllDiv.textContent = 'Delete all';

    mainWrapper.appendChild(deleteAllDiv);
  }
};

const deleteDeleteAllText = () => {
  const deleteAll = document.querySelector('.todo-list-delete-all');

  if (deleteAll) deleteAll.remove();
};

const onLoadPage = () => {
  const darkTheme = localStorage.getItem('dark-theme');
  const tasks = JSON.parse(localStorage.getItem('tasks'));
  const markedTasks = JSON.parse(localStorage.getItem('markedTasks'));

  addTaskInput.value = '';

  if (markedTasks === null) localStorage.setItem('markedTasks', JSON.stringify([]));
  if (tasks === null) localStorage.setItem('tasks', JSON.stringify([]));

  if (darkTheme === 'true') {
    document.body.classList.add('dark-theme');
    themeButton.innerHTML = `${sunSvgIcon}`;
  } else {
    document.body.classList.remove('dark-theme');
    themeButton.innerHTML = `${moonSvgIcon}`;
  }

  const getTasks = () => {
    let tasks = JSON.parse(localStorage.getItem('tasks'));
    const markedTasks = JSON.parse(localStorage.getItem('markedTasks'));

    if (tasks.length === 0 && markedTasks.length === 0) return renderNoTasksText();

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

addTaskForm.addEventListener('submit', handleSubmitTask);
addTaskInput.addEventListener('input', handleSubmitStateButton);
themeButton.addEventListener('click', handleThemeButton);
