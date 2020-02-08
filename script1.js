const inputElement = document.getElementsByClassName('input-task')[0];
const addTaskButton = document.getElementsByClassName('add-task-btn')[0];
const listContainer = document.getElementsByClassName('list-container')[0];
const footerContainer = document.getElementsByClassName('footer')[0];

addTaskButton.addEventListener('click', addTask);

let Arr = [];

window.onload = () => {
    Arr = JSON.parse(localStorage.getItem('tasksList')) || [];
    if (Arr.length) {
        Arr.forEach(el => renderTask(el.listId));
    }
}
function pushToLocalStorage() {
    localStorage.setItem('tasksList', JSON.stringify(Arr));
}

function addTask() {
    const text = inputElement.value;
    if (!text) {
        let div = document.createElement('div');
        div.style.width = '60%';
        div.style.height = '200px';
        div.style.backgroundColor = 'lightgrey';
        div.style.margin = 'auto';
        div.style.marginTop = '-200px';
        div.style.border = '3px solid grey';
        div.style.zIndex = '3';
        div.style.position = 'relative';
        div.style.borderRadius = '15px';
        div.style.color = 'red';
        div.style.fontWeight = 'bold';
        div.style.fontFamily = 'Segoe UI';
        div.style.fontSize = '35px';
        div.style.textAlign = 'center';
        div.style.display = 'block';
        document.body.appendChild(div);
        div.innerHTML += 'You are trying to add an empty task';

        let try_btn = document.createElement('button');
        try_btn.style.width = '200px';
        try_btn.style.height = '50px';
        try_btn.style.borderRadius = '15px';
        try_btn.style.backgroundColor = 'red';
        try_btn.style.marginLeft = '65%';
        try_btn.style.marginTop = '-20%';
        try_btn.style.position = 'relative';
        try_btn.style.zIndex = '4';
        try_btn.style.color = 'white';
        try_btn.style.textAlign = 'center';
        try_btn.style.fontWeight = 'bold';
        try_btn.style.fontFamily = 'Segoe UI';
        try_btn.style.fontSize = '25px';
        document.body.appendChild(try_btn);
        try_btn.innerHTML += 'Try again';

        try_btn.addEventListener('click', try_again);

        function try_again() {
            try_btn.style.display = 'none';
            div.style.display = 'none';
        }
        return;
    }

    const listId = +new Date().getTime();
    Arr.push({
        listId,
        text
    });

    pushToLocalStorage();
    renderTask(listId);
    inputElement.value = '';
}

function renderTask(listId) {
    const {
        text,
        done
    } = Arr.find(el => el.listId === listId);
    const html = `
    <p class="list-checkbox"></p>
    <p class="list-element-text"></p>
    <p class="list-delete-btn">delete</p>
  `;

    const listDivElement = document.createElement('div');

    listDivElement.innerHTML = html;
    listDivElement.classList.add('list-element');
    listContainer.appendChild(listDivElement);

    renderTasksInfo();

    const checkBox = listDivElement.getElementsByClassName('list-checkbox')[0];
    const taskTextElement = listDivElement.getElementsByClassName('list-element-text')[0];
    const deleteBtn = listDivElement.getElementsByClassName('list-delete-btn')[0];

    taskTextElement.innerText = text;

    if (done) {
        checkBox.style.backgroundColor = 'green';
        checkBox.innerHTML += '✓';
    }

    checkBox.addEventListener('click', () => clickOnCheckBox(listId, checkBox));
    taskTextElement.addEventListener('dblclick', () => editTask(listId, listDivElement));
    deleteBtn.addEventListener('click', () => clickToDeleteBtn(listId, listDivElement));
}

function clickOnCheckBox(listId, checkBox) {
    const listElement = Arr.find(el => el.listId === listId);

    if (listElement.done) return;

    listElement.done = true;
    checkBox.style.backgroundColor = 'green';
    checkBox.innerHTML += '✓';

    pushToLocalStorage();
    renderTasksInfo();
}

function editTask(listId, listDivElement) {
    let textField = listDivElement.getElementsByClassName('list-element-text')[0];

    textField.innerHTML = `
    <input type="text" placeholder="edit text" class="input-task-edit" value="${textField.innerText}">
    <button class="save-btn">save</button>
  `;
    const saveBtn = textField.getElementsByClassName('save-btn')[0];
    saveBtn.addEventListener("click", () => saveEditedTask(listId, textField));
}

function saveEditedTask(listId, textField) {
    const editedTask = textField.getElementsByClassName('input-task-edit')[0];
    const task = Arr.find(el => el.listId === listId);
    task.text = editedTask.value;
    textField.innerHTML = task.text;

    pushToLocalStorage();
}

function clickToDeleteBtn(listId, listDivElement) {
    const arrIndex = Arr.findIndex(el => el.listId === listId);
    Arr.splice(arrIndex, 1);
    listDivElement.remove();

    renderTasksInfo();
    pushToLocalStorage();
}

function renderTasksInfo() {
    const doneTasksArr = Arr.filter(el => el.done === true);
    const html = `
    <p>all: ${Arr.length}</p>
    <p>done: ${doneTasksArr.length}</p>
  `;
    footerContainer.innerHTML = html;
}
