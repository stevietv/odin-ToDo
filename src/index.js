import { addProject, addTodo, getProjects, getTodos } from "./models/storage";

// addProject("test project 2");

console.log(getProjects());

let projectId = getProjects()[0].id;

console.log(projectId);

// addTodo("test1", "descriotion of todo", "21/05/2025", "low", projectId);
// addTodo("test2", "description of todo", "22/05/2025", "low", projectId);

console.log(getProjects());
console.log(getTodos());
