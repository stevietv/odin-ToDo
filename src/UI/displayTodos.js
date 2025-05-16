import { getTodos } from "../models/storage";
import { Element } from "../helpers/helpers";
import { format, parseJSON } from "date-fns";

export function displayTodos() {
    let allTodos = getTodos();
    let todosContainer = document.getElementById("items");
    todosContainer.innerHTML = '';
    todosContainer.appendChild(generateEmptyTodoTable());

    let todoTableBody = document.getElementsByClassName('todoTableBody')[0];

    allTodos.forEach(todo => {
        todoTableBody.appendChild(generateTodoTableEntry(todo));
    });
}

function generateEmptyTodoTable() {
    let table = Element('table', ['todoTable']);

    let tableHead = Element('thead', ['todoTableHeader']);
    let tableRow = Element('tr');

    let columns = ['Title', 'Description', 'Due Date', 'Priority', 'Complete'];
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
    tableRow.appendChild(Element('td', ['todoItem'], '', format(todo.dueDate, 'P')));
    tableRow.appendChild(Element('td', ['todoItem'], '', todo.priority));
    tableRow.appendChild(Element('td', ['todoItem'], '', todo.isComplete));

    return tableRow;
}