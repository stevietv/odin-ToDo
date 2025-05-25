import { Element } from '../helpers/helpers';
import { format } from 'date-fns';
import { addTodo } from '../models/storage';
import { displayTodos } from '../UI/displayTodos';

export function generateTodoForm(project) {
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
    form.append(titleInput);

    let descriptionInput = Element('input', ['newDescription'], 'newDescription');
    descriptionInput.name = 'description';
    descriptionInput.placeholder = 'Description';
    descriptionInput.required = true;
    form.append(descriptionInput);

    let dateInput = Element('input', ['newDate'], 'newDate');
    dateInput.name = 'dueDate';
    dateInput.type = 'date';
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
    form.append(priorityInput);

    let submitButton = Element('button', ['Submit'], 'submitNewTodo', 'Submit');

    form.append(submitButton);

    return form;
}

export function generateAddTodoModal(project) {
    let dialog = Element('dialog', ['addTodoModal'], 'addTodoModal');

    let closeIcon = Element('div', ['closeIcon'], '', 'X');
    closeIcon.addEventListener('click', () => {
        dialog.close();
    })
    dialog.appendChild(closeIcon);

    let form  = generateTodoForm(project);


    form.addEventListener('submit', (event) => {
        event.preventDefault();
        let formData = new FormData(form);

        let title = formData.get('title');
        let description = formData.get('description');
        let dueDate = formData.get('dueDate');
        let priority = formData.get('priority');

        if (addTodo(title,  description, dueDate, priority, project)) {
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