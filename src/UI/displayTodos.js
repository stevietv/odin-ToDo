import { getTodos, getTodosByProject, deleteTodo, getTodoById, addTodo, toggleTodoComplete } from "../models/storage";
import { Element } from "../helpers/helpers";
import { format, isPast } from "date-fns";

let currentProject = '';
let showCompleted = false;

export function displayTodos(projectId = '') {
    let todos = getTodosToDisplay(projectId);

    let todosContainer = document.getElementById('items');
    todosContainer.innerHTML = '';

    let controlButtonsContainer = Element('div', ['controlButtonsContainer']);
    todosContainer.appendChild(controlButtonsContainer);
    controlButtonsContainer.appendChild(generateToggleCompletedButton());

    let todosTableContainer = Element('div', ['todosTableContainer']);
    todosContainer.appendChild(todosTableContainer);

    let todosTable = generateEmptyTodoTable();
    todosTableContainer.appendChild(todosTable);

    let todoTableBody = document.getElementsByClassName('todoTableBody')[0];

    todos.forEach(todo => {
        todoTableBody.appendChild(generateTodoTableEntry(todo));
    });

    addDeleteListeners();

    if (projectId !== '') {
        let todoTableFoot = Element('tfoot', ['todoTableFooter']);
        todoTableBody.parentNode.appendChild(todoTableFoot);
        todoTableFoot.appendChild(generateNewTodoRow());
        addNewTodoListener();
    }
}

function getTodosToDisplay(projectId) {
    let todos;
    if (projectId === '') {
        currentProject = '';
        todos = getTodos();
    }
    else {
        currentProject = projectId;
        todos = getTodosByProject(projectId);
    }
    if (!showCompleted) {
        return todos.filter(todos => todos.isComplete === showCompleted);
    }
    else return todos;
}

function generateEmptyTodoTable() {
    let table = Element('table', ['todoTable']);

    let tableHead = Element('thead', ['todoTableHeader']);
    let tableRow = Element('tr');

    let columns = ['Title', 'Description', 'Due Date', 'Priority', 'Complete', 'Delete'];
    columns.forEach(column => {
        tableRow.appendChild(Element('th', (column !== 'Title' && column !== 'Description') ? ['todoTableHeaderItem', 'center'] : ['todoTableHeaderItem', 'left'], `th-${column}`, column));
    });

    tableHead.appendChild(tableRow);
    table.appendChild(tableHead);
        
    table.appendChild(Element('tbody', ['todoTableBody']));
    return table;
}

function generateTodoTableEntry(todo) {
    let isCompleteCheckbox = Element('input', ['todoIsComplete'], todo.id);
    isCompleteCheckbox.type = 'checkbox';
    isCompleteCheckbox.checked = todo.isComplete;

    let isCompleteField = Element('td', ['todoItem', 'center']);
    isCompleteField.appendChild(isCompleteCheckbox);

    isCompleteCheckbox.addEventListener('change', () => {
        toggleTodoComplete(todo);
        displayTodos(currentProject);
    })

    let tableRow = Element('tr');
    
    tableRow.appendChild(Element('td', ['todoItem'], '', todo.title));
    tableRow.appendChild(Element('td', ['todoItem'], '', todo.description));
    tableRow.appendChild(Element('td', ['todoItem', 'center'], '', format(todo.dueDate, 'PP')));
    tableRow.appendChild(Element('td', ['todoItem', 'center'], '', todo.priority));
    tableRow.appendChild(isCompleteField);
    tableRow.appendChild(Element('td', ['todoItem', 'todoItemDelete', 'center'], todo.id, 'X'));

    if (!todo.isComplete && isPast(todo.dueDate)) {
        tableRow.classList.add('overdue');
    }

    return tableRow;
}

function generateNewTodoRow() {
    let titleField = Element('td',['newTodoItem']);
    let titleInput = Element('input', ['newTitle'], 'newTitle');
    titleInput.placeholder = 'New Title';
    titleField.append(titleInput);

    let descriptionField = Element('td', ['newTodoItem']);
    let descriptionInput = Element('input', ['newDescription'], 'newDescription');
    descriptionInput.placeholder = 'Description';
    descriptionField.append(descriptionInput);

    let dateField = Element('td', ['newDate']);
    let dateInput = Element('input', ['newDate'], 'newDate');
    dateInput.type = 'date';
    dateField.append(dateInput);

    let priorityField = Element('td', ['newPriority']);
    let priorityInput = Element('select', ['newPriority'], 'newPriority');
    let priorityOptions = ['Low', 'Medium', 'High'];
    priorityOptions.forEach(priority => {
        let option = document.createElement('option');
        option.value = priority;
        option.textContent = priority;
        priorityInput.append(option);
    });
    priorityField.append(priorityInput);

    let tableRow = Element('tr');
    
    tableRow.appendChild(titleField);
    tableRow.appendChild(descriptionField);
    tableRow.appendChild(dateField);
    tableRow.appendChild(priorityField);
    tableRow.appendChild(Element('td', ['newTodoItem'], '', ''));
    tableRow.appendChild(Element('td', ['newTodoItem', 'todoItemAdd'], '', '+'));

    return tableRow;
}

function generateToggleCompletedButton() {
    let button = Element('button',['toggleCompleted'], 'toggleCompleted');
    button.innerHTML = showCompleted ? 'Hide Completed' : 'Show Completed';
    button.addEventListener('click', () => {
        showCompleted = !showCompleted;
        button.innerHTML = showCompleted ? 'Hide Completed' : 'Show Completed';
        displayTodos(currentProject);
    })
    return button;
}

function addDeleteListeners() {
    let deleteButtons = document.querySelectorAll('td.todoItemDelete');

    deleteButtons.forEach(deleteButton => {
        deleteButton.addEventListener('click', () => {
            let todo = getTodoById(deleteButton.id);

            if (confirm(`Do you want to delete ${todo.title}`)) {
                deleteTodo(deleteButton.id);
                displayTodos(currentProject);
            }
        })
    })
}

function addNewTodoListener() {
    let addButton = document.querySelector('td.todoItemAdd');

    addButton.addEventListener('click', () => {
        let title = document.getElementById('newTitle').value;
        let description = document.getElementById('newDescription').value;
        let date = document.getElementById('newDate').value;
        if (date !== null && date !== '') {
            date = new Date(date);
        }
        let priority = document.getElementById('newPriority').value;

        if (title !== '' && date !== '') {
            addTodo(title, description, date, priority, currentProject);
            displayTodos(currentProject);
        }
    })
}