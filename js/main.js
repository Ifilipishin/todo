// нахожу элементы на странице
const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const tasksList = document.querySelector('#tasksList');
const emptyList = document.querySelector('#emptyList');

let tasks = []; 

if(localStorage.getItem('tasks')) {
   tasks = JSON.parse(localStorage.getItem('tasks'));
   tasks.forEach((task) => renderTask(task));
}

ckeckEmptyList ();

//добавления задач
form.addEventListener('submit', addTask);

//удаление задачи 
tasksList.addEventListener('click', deleteTask);

// отмечаем задачу завершенной
tasksList.addEventListener('click', doneTask);

//функция добавления задач
function addTask (event) {
    // отмена отправки формы
    event.preventDefault(); 

    // достаем текст из поля ввода
    const taskText = taskInput.value; 

    //описываем задачу в виде обьекта
    const newTask = {
        id: Date.now(),
        text: taskText,
        done: false
    };

    //добавляем задачу в массив с задачами
    tasks.push(newTask);

    renderTask(newTask);

//очищаем поле ввода и возвращаем фокус на него
taskInput.value = '';
taskInput.focus();

ckeckEmptyList ();

saveToLocalStorage();
}


//функция удаление
function deleteTask(event) {
    //проверяем если клик был не по кнопке удалть задачу
    if (event.target.dataset.action !== 'delete') return;
    
    //проверяем что клик был на кнопке удалить задачу
       const parenNode = event.target.closest('.list-group-item');

       //определяем id задачи 
       const id = Number(parenNode.id);

       //находим идекс задачи в массиве
       const index = tasks.findIndex( (task)=> task.id === id);
       
      //удаляем задачу из массива с задачами 
       tasks.splice(index, 1);

       //удаляем задачу из разметки
       parenNode.remove();
       
       ckeckEmptyList ();

       saveToLocalStorage();
}

// функция отмечения завершеной задачи
function doneTask(event){
// проверяем что клик был не на кнопке задача выполнена
    if(event.target.dataset.action !== 'done') return;

    //проверяем что клик был по кнопке 'задача выполнена'
    const parenNode = event.target.closest('.list-group-item');

    // отправляем id задачи
    const id = Number(parenNode.id);

    const task = tasks.find( (task) => task.id === id);

    task.done = !task.done;

    const taskTitle = parenNode.querySelector('.task-title');
    taskTitle.classList.toggle('task-title--done');

    saveToLocalStorage();
     
}

function ckeckEmptyList (){
    if(tasks.length === 0){
        const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
        <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
        <div class="empty-list__title">Список дел пуст</div>
    </li>`;
    tasksList.insertAdjacentHTML('afterbegin', emptyListHTML);
    }

    if(tasks.length > 0) {
        const emptyListEl = document.querySelector('#emptyList');
        emptyListEl ? emptyListEl.remove() : null;
    }
}

function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTask(task) {
    const cssClass = task.done ? 'task-title task-title--done' : 'task-title';

    // формируем разметку для новой задачи
    const taskHTML = `<li id ='${task.id}' class="list-group-item d-flex justify-content-between task-item">
    <span class="${cssClass}">${task.text}</span>
    <div class="task-item__buttons">
        <button type="button" data-action="done" class="btn-action">
            <img src="./img/tick.svg" alt="Done" width="18" height="18">
        </button>
        <button type="button" data-action="delete" class="btn-action">
            <img src="./img/cross.svg" alt="Done" width="18" height="18">
        </button>
    </div>
</li>`;

//добавляем задачу на страницу
tasksList.insertAdjacentHTML('beforeend', taskHTML);
}