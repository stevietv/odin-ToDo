import { addProject, addTodo, getProjects, getTodos, getTodosByProject } from "./models/storage";
import { displayProjects } from "./UI/displayProjects";
import './styles.css';
import { displayTodos } from "./UI/displayTodos";

console.log(getProjects());

let projectId = getProjects()[0].id;

console.log(projectId);

console.log(getProjects());
console.log(getTodos());

addProject("test2");
addTodo("new", "new2", new Date(), "high", "de019bea-65b7-4614-a0d1-e904ee954074");
console.log(getTodosByProject("de019bea-65b7-4614-a0d1-e904ee954074"));

displayProjects();
displayTodos();