import { Project, createProject } from "./project";
import { Todo, createTodo } from "./todo";

let projects = [];
loadProjects();
let todos = [];
loadTodos();


function loadProjects() {
    let savedProjects = JSON.parse(localStorage.getItem("projects") ?? '[]');
    console.log(`there are ${savedProjects.length} saved projects`)
    if (savedProjects.length > 0)
        projects = savedProjects.map(p => new Project(p.id, p.title));
    else {
        addProject("Default Project");
    }
}

function loadTodos() {
    let savedTodos = JSON.parse(localStorage.getItem("todos") ?? "[]");
    console.log(`there are ${savedTodos.length} saved todos`)
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
            "low",
            projects[0].id
        );
    }
}

export function addProject(title) {
    if (!projects.some(p => p.getProject().title === title)) {
        projects.push(createProject(title));
        localStorage.setItem("projects", JSON.stringify(projects))
    }
}

export function addTodo(title, description, dueDate, priority, projectId) {
    console.log(`Adding todo to project ${projectId}`)
    if (projects.some(p => p.getProject().id === projectId)) {
        todos.push(createTodo(title, description, dueDate, priority, projectId));
        localStorage.setItem("todos", JSON.stringify(todos))
    }
    else {
        console.log("Project does not exist to add todo to");
    }
}

export function deleteTodo(todoId) {
    todos = todos.filter(todo => todo.id !== todoId)
    console.log(todos);
    localStorage.setItem("todos", JSON.stringify(todos));
}

export function getProjects() {
    return projects;
}

export function getTodos() {
    return todos;
}

export function getTodosByProject(projectId) {
    let filteredTodos = todos.filter(t => t.projectId === projectId)
    return filteredTodos;
}