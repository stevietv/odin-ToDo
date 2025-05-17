import { getTodos, getTodosByProject, deleteTodo, getTodoById, addTodo } from "../models/storage";
import { Element } from "../helpers/helpers";
import { format } from "date-fns";

let currentProject = '';

export function displayTodos(projectId = '') {
    let todos;

    if (projectId === '') {
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

    if (projectId !== '') {
        let todoTableFoot = Element('tfoot', ['todoTableFooter']);
        todoTableBody.parentNode.appendChild(todoTableFoot);
        todoTableFoot.appendChild(generateNewTodoRow());
        addNewTodoListener();
    }

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