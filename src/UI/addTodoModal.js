import { Element } from '../helpers/helpers';
import { format } from 'date-fns';
import { addTodo, editTodo } from '../models/storage';
import { displayTodos } from '../UI/displayTodos';

export function generateTodoForm(project, todo = null) {
    let form = Element('form', ['todoForm'], 'todoForm');

    let projectInput = Element('input', [], 'project');
    projectInput.name = 'project';
    projectInput.type = 'hidden';
    projectInput.value = project;
    form.appendChild(projectInput);

    let titleInput = Element('input', ['newTitle'], 'newTitle');
    titleInput.name = 'title';
    titleInput.placeholder = 'New Title';
    titleInput.required = true;
    if (todo !== null) {
        titleInput.value = todo.title;
    }
    form.append(titleInput);

    let descriptionInput = Element('input', ['newDescription'], 'newDescription');
    descriptionInput.name = 'description';
    descriptionInput.placeholder = 'Description';
    descriptionInput.required = true;
    if (todo !== null) {
        descriptionInput.value = todo.description;
    }
    form.append(descriptionInput);

    let dateInput = Element('input', ['newDate'], 'newDate');
    dateInput.name = 'dueDate';
    dateInput.type = 'date';
    if (todo !== null) {
        dateInput.value = format(todo.dueDate, 'yyyy-MM-dd');
    }
    else
        dateInput.value = format(new Date(),'yyyy-MM-dd');
    dateInput.required = true;
    form.append(dateInput);

    let priorityInput = Element('select', ['newPriority'], 'newPriority');
    priorityInput.name = 'priority';
    let priorityOptions = ['Low', 'Medium', 'High'];
    priorityOptions.forEach(priority => {
        let option = document.createElement('option');
        option.value = priority;
        option.textContent = priority;
        priorityInput.append(option);
    });
    if (todo !== null) {
        priorityInput.value = todo.priority;
    }
    form.append(priorityInput);

    let submitButtonText = todo ? 'Edit' : 'Add';

    let submitButton = Element('button', ['Submit'], 'submitNewTodo', submitButtonText);

    form.append(submitButton);

    return form;
}

export function generateAddTodoModal(project, todo = null) {
    let dialog = Element('dialog', ['addTodoModal'], 'addTodoModal');

    let closeIcon = Element('div', ['closeIcon'], '', 'X');
    closeIcon.addEventListener('click', () => {
        dialog.close();
    })
    dialog.appendChild(closeIcon);

    let form  = generateTodoForm(project, todo);

    console.log(todo);


    form.addEventListener('submit', (event) => {
        event.preventDefault();
        let formData = new FormData(form);

        let title = formData.get('title');
        let description = formData.get('description');
        let dueDate = formData.get('dueDate');
        let priority = formData.get('priority');
        let project = formData.get('project');

        if (!todo && addTodo(title,  description, dueDate, priority, project)) {
            dialog.close();
            displayTodos(project);
        }

        if (todo) {
            todo.title = title;
            todo.description = description;
            todo.dueDate = dueDate;
            todo.priority = priority;
        }

        if (todo && editTodo(todo)) {
            dialog.close();
            displayTodos(project);
        }
    });

    dialog.appendChild(form);

    dialog.addEventListener('close', () => {
        form.reset();
        displayTodos(project);
    })

    return dialog;
}