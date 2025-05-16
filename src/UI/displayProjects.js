import { getProjects } from "../models/storage";
import { Element } from "../helpers/helpers";

export function displayProjects() {
    let allProjects = getProjects();
    let projectsContainer = document.getElementById("projects");
    projectsContainer.innerHTML = "";


    allProjects.forEach(project => {
        projectsContainer.appendChild(Element('div', ['projectItem'], project.id, project.title));
    });
}