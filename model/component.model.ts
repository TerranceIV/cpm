export interface ProjectDetails {
    projectKey:string;
    projectTitle:string;
    status:boolean;
    projectDueDate:string;
    projectDescription:string;
    projectAssign:string;
}

export interface TaskDetails {
    key?:string;
    taskTitle:string;
    status:boolean;
    taskDueDate:string;
    taskDescription:string;
    taskAssign:string;
    projectKey:string;
}
