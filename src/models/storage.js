import { createProject, Project } from "./project";
import { createTodo, Todo } from "./todo";

let projects = [];
let todos = [];
loadProjects();
loadTodos();


function loadProjects() {
    let savedProjects = JSON.parse(localStorage.getItem("projects") ?? '[]');
    if (savedProjects.length > 0)
        projects = savedProjects.map(p => new Project(p.id, p.title));
    else {
        addProject("Default Project");
    }
}

function loadTodos() {
    let savedTodos = JSON.parse(localStorage.getItem("todos") ?? "[]");

    if (savedTodos.length > 0) {
        todos = savedTodos.map(t => {
            const todo = new Todo(
                t.id,
                t.title,
                t.description,
                t.dueDate,
                t.priority,
                t.projectId);
            todo.isComplete = t.isComplete;
            return todo;
        });
    }
    else {
        const nextWeek = new Date();
        nextWeek.setDate(new Date().getDate() + 7);
        addTodo(
            "Default Todo", 
            "This is an example Todo",
            nextWeek,
            "Low",
            projects[0].id
        );
    }
}

export function addProject(title) {
    if (!projects.some(p => p.getProject().title === title)) {
        projects.push(createProject(title));
        saveToLocalStorage();
    }
}

export function deleteProject(projectId) {
    projects = projects.filter(project => project.getProject().id !== projectId);
    todos = todos.filter(todo => todo.projectId !== projectId);
    saveToLocalStorage();
}

export function addTodo(title, description, dueDate, priority, projectId) {
    console.log(`Adding todo to project ${projectId}`)
    if (projects.some(p => p.getProject().id === projectId)) {
        todos.push(createTodo(title, description, dueDate, priority, projectId));
        todos.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        saveToLocalStorage();
        return true;
    }
    else {
        console.log("Project does not exist to add todo to");
        return false;
    }
}

export function editTodo(todo) {
    console.log(`editing todo with id ${todo.id}`)
    let index = todos.findIndex(t => t.id === todo.id)
    if (index >= 0) {
        todos.splice(index, 1, todo);
        todos.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        saveToLocalStorage();
        return true;
    }
   return false;
}

export function deleteTodo(todoId) {
    todos = todos.filter(todo => todo.id !== todoId)
    saveToLocalStorage();
}

export function toggleTodoComplete(updatedTodo) {
    let index = todos.findIndex(todo => todo.id === updatedTodo.id);
    updatedTodo.toggleComplete();
    if (index !== -1 ) {
         todos.splice(index, 1, updatedTodo);
         saveToLocalStorage();
     }
}

export function getProjects() {
    return projects;
}

export function getProjectById(projectId) {
    return projects.find(project => project.id === projectId);
}

export function getTodos() {
    return todos;
}

export function getTodosByProject(projectId) {
    return todos.filter(t => t.projectId === projectId);
}

function saveToLocalStorage() {
    localStorage.setItem("todos", JSON.stringify(todos));
    localStorage.setItem("projects", JSON.stringify(projects));
}