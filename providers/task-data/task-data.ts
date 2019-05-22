import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import * as firebase from 'firebase';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable()
export class TaskDataProvider {

private fireRef: any;
private tasksNode: any;
private taskListsNode: any;

constructor(private firedb:AngularFireDatabase) {

  this.tasksNode = firebase.database().ref('tasks');
  this.taskListsNode = firebase.database().ref('task-lists');
  this.fireRef = firebase.database().ref();

}

checkTask(projectKey:any){
  return firebase.database().ref('task-lists').child(projectKey).once('value');
}

updateTask(task:any,newprojectId:any,oldprojectId:any){

  var taskData = {
    taskTitle: task.taskTitle,
    taskDescription: task.taskDescription,
    taskAssign: task.taskAssign,
    taskDueDate: task.taskDueDate,
    taskStatus: task.taskStatus,
    projectId: newprojectId
  };

  var NoprojectIdtask ={
    taskTitle: task.taskTitle,
    taskDescription: task.taskDescription,
    taskAssign: task.taskAssign,
    taskDueDate: task.taskDueDate,
    taskStatus: task.taskStatus,
  }

  var updatePath = {};
  updatePath['/tasks/' + task.taskKey] = taskData; 
  updatePath['/task-lists/' +newprojectId+"/" +task.taskKey] = NoprojectIdtask;
  this.deleteTask(task.taskKey);
  this.deleteTaskList(oldprojectId,task.taskKey);
  //update both tables simultaneously
  return this.fireRef.update(updatePath);
  
}

deleteTask(taskKey:any){
  return this.firedb.list('/tasks/').remove(taskKey);
}

deleteTaskList(projectId:any,taskKey:any){
  return this.firedb.list('/task-lists/'+projectId).remove(taskKey);
}

// deleteTaskAfterprojectdel(projectKey:any){
//   return this.firedb.list('/tasks/',ref => ref.orderByChild('projectId').equalTo(projectKey)).remove();
// }
deleteTaskListAfterprojectdel(projectId:any){
  return this.firedb.list('/task-lists/').remove(projectId);
}

getTasklist(projectId:any){
  return this.firedb.list('/task-lists/'+projectId);
}  

//view a certain task 
viewtaskService(taskId:any){
	var userRef = this.tasksNode.child(taskId);
	return userRef.once('value'); 
}

//view all tasks made by this userId
viewProjecttaskService(userId: any){
	var userRef = this.taskListsNode.child(userId); //get the task list made by certain user
	return userRef.once('value'); 
}

listtaskService(){
  return this.tasksNode.once('value'); 
}

createTaskService(userId: any, taskTitle: any, taskDescription :any, taskAssign :any, taskDueDate:any, taskStatus:any, projectId:any){
  	
  var taskData = {
    taskTitle: taskTitle,
    taskDescription: taskDescription,
    taskAssign: taskAssign,
    taskDueDate: taskDueDate,
    taskStatus: taskStatus,
    projectId: projectId
  };

  var NoprojectIdtask ={
    taskTitle: taskTitle,
    taskDescription: taskDescription,
    taskAssign: taskAssign,
    taskDueDate: taskDueDate,
    taskStatus: taskStatus,
  }

  // Get a key for a new task.
  var newPostKey = this.tasksNode.push().key;

  // Write the new task's data simultaneously in the task  and the task list.
  var updatePath = {};
  updatePath['/tasks/' + newPostKey] = taskData; 
  updatePath['/task-lists/' +projectId+"/" +newPostKey] = NoprojectIdtask;
  
  //update both tables simultaneously
  return this.fireRef.update(updatePath);
  
  }
  	 
}