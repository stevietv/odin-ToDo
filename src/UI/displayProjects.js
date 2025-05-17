import { getProjects, addProject } from "../models/storage";
import { Element } from "../helpers/helpers";
import { displayTodos } from "./displayTodos";

export function displayProjects() {
    let allProjects = getProjects();
    let projectsContainer = document.getElementById("projects");
    projectsContainer.innerHTML = "";

    projectsContainer.appendChild(Element('div', ['projectItem', 'projectItemAll'], '', 'All Projects'));
    projectsContainer.appendChild(Element('hr'));


    allProjects.forEach(project => {
        projectsContainer.appendChild(Element('div', ['projectItem'], project.id, project.title));
    });


    projectsContainer.appendChild(Element('hr'));
    projectsContainer.appendChild(Element('div', ['newProject'], 'newProject',"Add New Project"));

    addProjectListeners();
    addNewProjectListener();
}

function addProjectListeners() {
    const projects = document.querySelectorAll('div.projectItem');

    projects.forEach(project => {
        project.addEventListener('click', () => {
            displayTodos(project.id);
        })
    })
}

function addNewProjectListener() {
    const newProjectButton = document.getElementById('newProject');

    newProjectButton.addEventListener('click', () => {
        let newProject = prompt("What is the new project name?");

        if (newProject !== null) {
            addProject(newProject);
            displayProjects();
        }
    })
}