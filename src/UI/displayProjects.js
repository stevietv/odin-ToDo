import { getProjects } from "../models/storage";
import { Element } from "../helpers/helpers";
import { showProjectTodos } from "./displayTodos";

export function displayProjects() {
    let allProjects = getProjects();
    let projectsContainer = document.getElementById("projects");
    projectsContainer.innerHTML = "";


    allProjects.forEach(project => {
        projectsContainer.appendChild(Element('div', ['projectItem'], project.id, project.title));
    });

    addProjectListeners();
}

function addProjectListeners() {
    const projects = document.querySelectorAll('div.projectItem');

    projects.forEach(project => {
        project.addEventListener('click', () => {
            showProjectTodos(project.id);
        })
    })
}