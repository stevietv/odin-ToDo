import {v4 as uuidv4 } from 'uuid';

class Todo {
    constructor(id, title, description, dueDate, priority) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.isComplete = false;
    }

    getTodo() {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            dueDate: this.dueDate,
            priority: this.priority,
            isComplete: this.isComplete,
        };
    }

    setComplete() {
        this.isComplete = true;
    }
}

export function createTodo(title, description, dueDate, priority) {
    let id = uuidv4();
    return new Todo(id, title, description, dueDate, priority);
}