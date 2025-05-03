import { v4 as uuidv4 } from 'uuid';
import { createTodo } from '../todo/todo';

class Project {
    constructor(id, title) {
        this.id = id;
        this.title = title;
        this.todos = []
    }

    getProject() {
        return {
            id: this.id,
            title: this.title,
        };
    }

    addTodo(title, description, dueDate, priority) {
        let todo = createTodo(title, description, dueDate, priority);
        this.todos.push(todo);
    }
}

export function createProject(title) {
    let id = uuidv4();
    return new Project(id, title);
}