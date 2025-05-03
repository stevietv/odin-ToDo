import { createProject } from "./project/project";

let project = createProject("test project");

console.log(project);

project.addTodo("test1", "descriotion of todo", "21/05/2025", "low");
project.addTodo("test2", "description of todo", "22/05/2025", "low");

console.log(project);
