import { getTodos, getTodosByProject, deleteTodo, addTodo, toggleTodoComplete, deleteProject, getProjectById } from "../models/storage";
import { Element } from "../helpers/helpers";
import { add, format, isPast } from "date-fns";
import { displayProjects } from './displayProjects';
import { generateAddTodoModal } from './addTodoModal';

let currentProject = '';
let showCompleted = false;

export function createBaseTodosLayout() {
    let todosContainer = document.getElementById('items');
    todosContainer.innerHTML = '';

    let controlButtonsContainer = Element('div', ['controlButtonsContainer']);
    todosContainer.appendChild(controlButtonsContainer);

    let controlButtonsLeft = Element('div', ['controlButtonsLeft']);
    let controlButtonsRight = Element('div', ['controlButtonsRight']);
    controlButtonsContainer.appendChild(controlButtonsLeft);
    controlButtonsContainer.appendChild(controlButtonsRight);

    controlButtonsContainer.appendChild(createAddTodoButton());

    controlButtonsRight.appendChild(createTodoToggleCompletedButton());
    controlButtonsRight.appendChild(createDeleteProjectButton());

    let todosTableContainer = Element('div', ['todosTableContainer']);
    todosContainer.appendChild(todosTableContainer);

    todosTableContainer.appendChild(createTodoTable());
}

export function displayTodos(projectId = '') {
    let todos = getTodosToDisplay(projectId);

    let todoTableBody = document.getElementById('todoTableBody');
    todoTableBody.innerHTML = '';

    todos.forEach(todo => {
        todoTableBody.appendChild(createTodoRow(todo));
    });

    let deleteProjectButton = document.getElementById('deleteProject');
    let addNewTodoButton = document.getElementById('addTodo');

    deleteProjectButton.disabled = (projectId === '');
    addNewTodoButton.disabled = (projectId === '');

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
        return todos.filter(todo => todo.isComplete === showCompleted);
    }
    else return todos;
}

function createTodoTable() {
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
    return table;
}

function createTodoRow(todo) {
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

    editButton.addEventListener('click', () => {
        let oldDialog = document.getElementById('addTodoModal');
        let dialog = generateAddTodoModal(currentProject, todo);
        if (oldDialog) {
            document.body.replaceChild(dialog, oldDialog);
        }
        else document.body.appendChild(dialog);
        dialog.showModal()
    })

    actionsCell.appendChild(editButton);
    actionsCell.appendChild(deleteButton);

    let tableRow = Element('tr');
    
    tableRow.appendChild(Element('td', ['todoItem'], '', todo.title));
    tableRow.appendChild(Element('td', ['todoItem'], '', todo.description));
    tableRow.appendChild(Element('td', ['todoItem', 'center'], '', format(todo.dueDate, 'PP')));
    tableRow.appendChild(Element('td', ['todoItem', 'center'], '', todo.priority));
    tableRow.appendChild(isCompleteField);
    tableRow.appendChild(actionsCell);

    if (!todo.isComplete && isPast(add(todo.dueDate, { days: 1 }))) {
        tableRow.classList.add('overdue');
    }

    return tableRow;
}

function createTodoToggleCompletedButton() {
    let button = Element('button',['toggleCompleted'], 'toggleCompleted');
    button.innerHTML = showCompleted ? 'Hide Completed' : 'Show Completed';
    button.addEventListener('click', () => {
        showCompleted = !showCompleted;
        button.innerHTML = showCompleted ? 'Hide Completed' : 'Show Completed';
        displayTodos(currentProject);
    })
    return button;
}

function createDeleteProjectButton() {
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

function createAddTodoButton() {
    let button = Element('button',['addTodo'], 'addTodo');
    button.innerHTML = 'Add Todo';
    button.addEventListener('click', () => {
        let oldDialog = document.getElementById('addTodoModal');
        let dialog = generateAddTodoModal(currentProject);
        if (oldDialog) {
            document.body.replaceChild(dialog, oldDialog);
        }
        else document.body.appendChild(dialog);
        dialog.showModal()
    })

    return button;
}