import { getTodos, getTodosByProject, deleteTodo, addTodo, toggleTodoComplete, deleteProject, getProjectById } from "../models/storage";
import { Element } from "../helpers/helpers";
import { format, isPast } from "date-fns";
import { displayProjects } from './displayProjects';

let currentProject = '';
let showCompleted = false;

export function generateBaseTodosLayout() {
    let todosContainer = document.getElementById('items');
    todosContainer.innerHTML = '';

    let controlButtonsContainer = Element('div', ['controlButtonsContainer']);
    todosContainer.appendChild(controlButtonsContainer);

    controlButtonsContainer.appendChild(generateToggleCompletedButton());
    controlButtonsContainer.appendChild(generateDeleteProjectButton());

    let todosTableContainer = Element('div', ['todosTableContainer']);
    todosContainer.appendChild(todosTableContainer);

    todosTableContainer.appendChild(generateEmptyTodoTable());
}

export function displayTodos(projectId = '') {
    let todos = getTodosToDisplay(projectId);

    let todoTableBody = document.getElementById('todoTableBody');
    todoTableBody.innerHTML = '';

    todos.forEach(todo => {
        todoTableBody.appendChild(generateTodoTableEntry(todo));
    });

    let todoTableFoot = document.getElementById('todoTableFooter');
    todoTableFoot.innerHTML = '';

    if (projectId !== '') {
        todoTableFoot.appendChild(generateNewTodoRow());
        addNewTodoListener();
    }

    let deleteProjectButton = document.getElementById('deleteProject');

    deleteProjectButton.disabled = (projectId === '');

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

    let columns = ['Title', 'Description', 'Due Date', 'Priority', 'Complete', 'Actions'];
    columns.forEach(column => {
        tableRow.appendChild(Element('th', (column !== 'Title' && column !== 'Description') ? ['todoTableHeaderItem', 'center'] : ['todoTableHeaderItem', 'left'], `th-${column}`, column));
    });

    tableHead.appendChild(tableRow);
    table.appendChild(tableHead);
        
    table.appendChild(Element('tbody', ['todoTableBody'], 'todoTableBody'));
    table.appendChild(Element('tfoot', ['todoTableFooter'], 'todoTableFooter'));
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

    let actionsCell = Element('td', ['todoItem', 'todoItemActions', 'center']);

    let deleteButton = Element('div', ['todoItemDelete', 'center'], '', 'X')

    deleteButton.addEventListener('click', () => {
        if (confirm(`Do you want to delete ${todo.title}`)) {
            deleteTodo(todo.id);
            displayTodos(currentProject);
        }
    })

    let editButton = Element('div', ['todoItemEdit', 'center'], '', 'E');

    actionsCell.appendChild(editButton);
    actionsCell.appendChild(deleteButton);

    let tableRow = Element('tr');
    
    tableRow.appendChild(Element('td', ['todoItem'], '', todo.title));
    tableRow.appendChild(Element('td', ['todoItem'], '', todo.description));
    tableRow.appendChild(Element('td', ['todoItem', 'center'], '', format(todo.dueDate, 'PP')));
    tableRow.appendChild(Element('td', ['todoItem', 'center'], '', todo.priority));
    tableRow.appendChild(isCompleteField);
    tableRow.appendChild(actionsCell);

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

    let dateField = Element('td', ['newDate', 'center']);
    let dateInput = Element('input', ['newDate'], 'newDate');
    dateInput.type = 'date';
    dateInput.value = format(new Date(),'yyyy-MM-dd');
    dateField.append(dateInput);

    let priorityField = Element('td', ['newPriority', 'center']);
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
    tableRow.appendChild(Element('td', ['newTodoItem', 'center'], '', ''));
    tableRow.appendChild(Element('td', ['newTodoItem', 'todoItemAdd', 'center'], '', '+'));

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

function generateDeleteProjectButton() {
    let button = Element('button',['deleteProject'], 'deleteProject');
    button.innerHTML = 'Delete Project';
    button.addEventListener('click', () => {
        let projectTitle = getProjectById(currentProject).title;
        if (confirm(`Do you want to delete the project '${projectTitle}' and all associated todos?`)) {
            deleteProject(currentProject);
            displayTodos();
            displayProjects();
        }
    })
    return button;
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