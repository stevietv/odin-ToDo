import { v4 as uuidv4 } from 'uuid';

export class Todo {
    constructor(id, title, description, dueDate, priority, projectId) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.isComplete = false;
        this.projectId = projectId;
    }

    getTodo() {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            dueDate: this.dueDate,
            priority: this.priority,
            isComplete: this.isComplete,
            projectId: this.projectId,
        };
    }

    getProject() {
        return this.projectId;
    }

    toggleComplete() {
        this.isComplete = !this.isComplete;
    }
}

export function createTodo(title, description, dueDate, priority, projectId) {
    let id = uuidv4();
    return new Todo(id, title, description, dueDate, priority, projectId);
}