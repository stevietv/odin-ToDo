import { displayProjects } from "./UI/displayProjects";
import './styles.css';
import './resetStyles.css';
import { displayTodos, createBaseTodosLayout } from "./UI/displayTodos";

createBaseTodosLayout();
displayProjects();
displayTodos();