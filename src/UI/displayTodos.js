import { getTodos, getTodosByProject, deleteTodo } from "../models/storage";
import { Element } from "../helpers/helpers";
import { format, parseJSON } from "date-fns";

let currentProject = '';

export function displayTodos(projectId = 0) {
    let todos;

    if (projectId == 0) {
        currentProject = '';
        todos = getTodos();
    }
    else {
        currentProject = projectId;
        todos = getTodosByProject(projectId);
    }

    let todosContainer = document.getElementById("items");
    
    todosContainer.innerHTML = '';
    todosContainer.appendChild(generateEmptyTodoTable());

    let todoTableBody = document.getElementsByClassName('todoTableBody')[0];

    todos.forEach(todo => {
        todoTableBody.appendChild(generateTodoTableEntry(todo));
    });

    addDeleteListeners();
}


function generateEmptyTodoTable() {
    let table = Element('table', ['todoTable']);

    let tableHead = Element('thead', ['todoTableHeader']);
    let tableRow = Element('tr');

    let columns = ['Title', 'Description', 'Due Date', 'Priority', 'Complete', 'Delete'];
    columns.forEach(column => {
        tableRow.appendChild(Element('th', ['todoTableHeaderItem'], '', column));
    });

    tableHead.appendChild(tableRow);
    table.appendChild(tableHead);
        
    table.appendChild(Element('tbody', ['todoTableBody']));
    return table;
}

function generateTodoTableEntry(todo) {
    let tableRow = Element('tr');
    
    tableRow.appendChild(Element('td', ['todoItem'], '', todo.title));
    tableRow.appendChild(Element('td', ['todoItem'], '', todo.description));
    tableRow.appendChild(Element('td', ['todoItem'], '', format(todo.dueDate, 'PP')));
    tableRow.appendChild(Element('td', ['todoItem'], '', todo.priority));
    tableRow.appendChild(Element('td', ['todoItem'], '', todo.isComplete));
    tableRow.appendChild(Element('td', ['todoItem', 'todoItemDelete'], todo.id, 'X'));

    return tableRow;
}

function addDeleteListeners() {
    let deleteButtons = document.querySelectorAll('td.todoItemDelete');

    deleteButtons.forEach(deleteButton => {
        deleteButton.addEventListener('click', () => {
            deleteTodo(deleteButton.id);
            displayTodos(currentProject);
        })
    })
}