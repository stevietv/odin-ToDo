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
addTodo("new", "new2", new Date(), "high", "f01c19e7-5a08-46c6-aec7-d5f4f5f39394");
console.log(getTodosByProject("f01c19e7-5a08-46c6-aec7-d5f4f5f39394"));

displayProjects();
displayTodos();