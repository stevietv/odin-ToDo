import { getProjects } from "../models/storage";
import { Element } from "../helpers/helpers";
import { displayTodos } from "./displayTodos";

export function displayProjects() {
    let allProjects = getProjects();
    let projectsContainer = document.getElementById("projects");
    projectsContainer.innerHTML = "";

    projectsContainer.appendChild(Element('div', ['projectItem', 'projectItemAll'], 0, 'All Projects'));
    projectsContainer.appendChild(Element('hr'));


    allProjects.forEach(project => {
        projectsContainer.appendChild(Element('div', ['projectItem'], project.id, project.title));
    });

    addProjectListeners();
}

function addProjectListeners() {
    const projects = document.querySelectorAll('div.projectItem');

    projects.forEach(project => {
        project.addEventListener('click', () => {
            displayTodos(project.id);
        })
    })
}