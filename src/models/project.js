import { v4 as uuidv4 } from 'uuid';

export class Project {
  constructor(id, title) {
    this.id = id;
    this.title = title;
  }

  getProject() {
    return {
      id: this.id,
      title: this.title,
    };
  }
}

export function createProject(title) {
  let id = uuidv4();
  return new Project(id, title);
}
