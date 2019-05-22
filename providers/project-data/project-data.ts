import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import * as firebase from 'firebase';
import * as moment from 'moment';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable()
export class ProjectDataProvider {

private FirebaseRef;
private fireRef: any;
private userNode: any;
private projectsNode: any;
private documentsNode;
private projectListsNode: any;
private notiNode:any;

constructor(private firedb:AngularFireDatabase) {

  this.FirebaseRef=firebase.storage().ref(); 
  this.fireRef = firebase.database().ref();
  this.userNode = firebase.database().ref('data_users');
  this.projectsNode = firebase.database().ref('projects');
  this.notiNode = firebase.database().ref('notifications');
  this.documentsNode = firebase.database().ref('project-document');
  this.projectListsNode = firebase.database().ref('project-lists')
    
}

uploadFile(projectKey:any,blob:any,fileName:any){

  var fullpath;
  
  this.FirebaseRef.child(projectKey+'/files/'+fileName).put(blob); //put file into firebase storage
  fullpath= this.FirebaseRef.child(projectKey+'/files/'+fileName).fullPath; //save file path 

  var DocumentURL ={
    documentName:fileName,
    fullPath:fullpath
  }
  var updatePath = {};

  var documentKey= this.documentsNode.push().key;
  updatePath['/project-document/' +projectKey+"/"+ documentKey] = DocumentURL;
  

  //update both tables simultaneously
  return this.fireRef.update(updatePath);
  
}

getNotiListNum(userId:any){
  return this.firedb.list('/notifications/'+userId)
}

getNotiList(userId:any){
  return this.firedb.list('/notifications/'+userId);
}
     
getNotiListSeen(userId:any){
  return this.firedb.list('/notifications/'+userId,ref => ref.orderByChild('readState').equalTo("seen")); 
}     
getNotiListUnseen(userId:any){
  return this.firedb.list('/notifications/'+userId,ref =>  ref.orderByChild('readState').equalTo("unseen")); 
}    

deleteNoti(notiKey:any,userId:any){
  return this.firedb.list('/notifications/'+userId).remove(notiKey);
}

updateNotiList(userId:any,notiData:any){
  var updatePath = {};
  var notificationData ={
    userPicture:  notiData.userPicture,
    userName:     notiData.userName,
    projectTitle: notiData.projectTitle,
    message:      notiData.projectTitle + " is created." ,
    sendDate:     notiData.sendDate,
    sendTime:     notiData.sendTime,
    readState:   "seen",
  };

  updatePath['/notifications/' + userId+"/"+notiData.key] = notificationData; 
  this.fireRef.update(updatePath);
}

//testing purpose
getprojectlistitem(){
	return this.projectListsNode.once('value');
}

getUserList(){
  return this.firedb.list('/data_users',ref => ref.orderByChild('username'));
}

getProjectImage(projectId:any){
  return this.firedb.list('/project-image/'+projectId);
}

getProjectDoc(projectId:any){
  return this.firedb.list('/project-document/'+projectId);
}

//testing place 
getProjectlist(userId:any){
  return this.firedb.list('/project-lists/'+userId); //sort by the project title 
}       
getProjectlistbyTitle(userId:any){
  return this.firedb.list('/project-lists/'+userId,ref => ref.orderByChild('projectTitle')); //sort by the project title 
}     
getProjectlistbyDate(userId:any){
  return this.firedb.list('/project-lists/'+userId,ref => ref.orderByChild('projectDueDate')); //sort by the project title 
}     
getProjectlistbyTodayDate(userId:any){
  var todayDate= moment().format("YYYY-MM-DD");
  return this.firedb.list('/project-lists/'+userId,ref => ref.orderByChild('projectDueDate').equalTo(todayDate)); //sort by the project title 
}     

getCommentlist(projectId:any){
  return this.firedb.list('/project-discussion/'+projectId);;
}  
//view a certain project 
viewProjectService(projectId:any){
	var userRef = this.projectsNode.child(projectId);
	return userRef.once('value'); 
}

viewUser(userId: any){
  var userRef = this.userNode.child(userId);
  return userRef.once('value'); //help to find the specify id data 
}
//view all projects made by this userId
viewUsersProjectService(userId: any){
	var projectRef = this.projectListsNode.child(userId); //get the project list made by certain user
	return projectRef.once('value'); 
}

listProjectService(){
  return this.projectsNode.once('value'); 
}

updateProjectStatus(project:any,data:any,userId:any,userPic:any,userName:any){

  var num;
  
  var updatePath = {};
  
  num= project.projectAssign.length;

  for(let i=0;i<num;i++){

    var projectData = {
      projectOwner : userId,
      projectTitle: project.projectTitle,
      projectDescription: project.projectDescription,
      projectAssign: project.projectAssign,
      projectAssignUid:project.projectAssignUid,
      projectDueDate: project.projectDueDate,
      projectStatus: data,
      
    };
    
    var notificationData ={
      userPicture: userPic,
      userName: userName,
      projectTitle: project.projectTitle,
      message: userName  + " is updated the project status to "+ data,
      sendDate: moment().format("DD-MM-YYYY"),
      sendTime: moment().format("DD-MM-YYYY, h:mm a"),
      readState:"unseen",
    };
    
    var newNotiKey = this.notiNode.push().key;
    updatePath['/notifications/' + project.projectAssignUid[i]+"/"+ newNotiKey] = notificationData; 

    updatePath['/projects/' + project.key] = projectData; 
    updatePath['/project-lists/' +project.projectAssignUid[i]+"/"+ project.key] = projectData;
  }
  this.fireRef.update(updatePath);

}

UpdatingProjectService(userId: any, projectDetails:any,oldProject:any){

  var num;
  var userN=[];
 
  // Write the new project's data simultaneously in the project  and the project list.
  var updatePath = {};
  
 
  num= projectDetails.projectAssignUid.length; //count the number of PIC 
 
  for(let i=0;i<num;i++){
    this.userNode.child(projectDetails.projectAssignUid[i]).on("value", function(snapshot) {
      userN[i]=snapshot.val().username; //get the certain name from the userUid added
    })

  }

  for(let i=0;i<num;i++){
    

    var projectData = {
      projectOwner : userId,
      projectTitle: projectDetails.projectTitle,
      projectDescription: projectDetails.projectDescription,
      projectAssign: userN,
      projectAssignUid:projectDetails.projectAssignUid,
      projectDueDate: projectDetails.projectDueDate,
      projectStatus: projectDetails.projectStatus,
      
    };
  

     updatePath['/projects/' + projectDetails.projectKey] = projectData; 
     updatePath['/project-lists/' +projectDetails.projectAssignUid[i]+"/"+ projectDetails.projectKey] = projectData;
     
  }
  this.deleteProject(projectDetails.projectKey);
  this.deleteProjectListAfterUpdate(oldProject,projectDetails.projectKey);
  //update both tables simultaneously
  return this.fireRef.update(updatePath);
}



createProjectService(userId: any, projectDetails:any,projectFileName:any,blob:any,userPic:any,userName:any){

  var num;
  var userN=[];
  var fullpath; 
  var newPostKey = this.projectsNode.push().key;// Get a key for a new project.
  var FirebaseRef=firebase.storage().ref(); //refereces to firebase
  var newNotiKey = this.notiNode.push().key;
  var updatePath = {};

  if(projectFileName!=""){
    FirebaseRef.child(newPostKey+'/files/'+projectFileName).put(blob);
    fullpath= FirebaseRef.child(newPostKey+'/files/'+projectFileName).fullPath;
  }

  var DocumentURL ={
    documentName:projectFileName,
    fullPath:fullpath
  }

  num= projectDetails.assignPeople.length; //count the number of PIC 
 
  for(let i=0;i<num;i++){
    this.userNode.child(projectDetails.assignPeople[i]).on("value", function(snapshot) {
      userN[i]=snapshot.val().username;
    })

  }

  for(let i=0;i<num;i++){
    

    var projectData = {
      projectOwner : userId,
      projectTitle: projectDetails.projectTitle,
      projectDescription: projectDetails.projectDesc,
      projectAssign: userN,
      projectAssignUid:projectDetails.assignPeople,
      projectDueDate: projectDetails.dueDate,
      projectStatus: projectDetails.projectStatus,
      
    };
  

    var notificationData ={
      userPicture: userPic,
      userName: userName,
      projectTitle: projectDetails.projectTitle,
      message: userName  + " is created "+ projectDetails.projectTitle,
      sendDate: moment().format("DD-MM-YYYY"),
      sendTime: moment().format("DD-MM-YYYY, h:mm a"),
      readState:"unseen",
    };

     updatePath['/notifications/' + projectDetails.assignPeople[i]+"/"+newNotiKey] = notificationData; 
  
     updatePath['/projects/' + newPostKey] = projectData; 
     updatePath['/project-lists/' +projectDetails.assignPeople[i]+"/"+ newPostKey] = projectData;

  }
  
  if(projectFileName!=""){
    var documentKey= this.documentsNode.push().key;
    updatePath['/project-document/' +newPostKey+"/"+ documentKey] = DocumentURL;
  }

  //update both tables simultaneously
  return this.fireRef.update(updatePath);
  
  }

  createCommentImageService(userName:any,usercommentImage:any,fileName:any,projectId:any,userPic:any){

    var commentData ={
      userPicture: userPic,
      userName: userName,
      comment: usercommentImage,
      sendtime: moment().format("DD-MM-YYYY, h:mm a"),
    };

    
    
    this.createImageStorage(fileName,usercommentImage,projectId);

    return this.firedb.list('/project-discussion/'+ projectId).push(commentData);
  }

  createImageStorage(fileName,usercommentImage,projectId){
    var DocumentURL ={
      documentName:fileName,
      url:usercommentImage
    }
    var updatePath = {};
  
    var documentKey= this.documentsNode.push().key;
    updatePath['/project-image/' +projectId+"/"+ documentKey] = DocumentURL;
    return this.fireRef.update(updatePath); 
  }

  createCommentService(userName:any,usercomment:any,projectId:any,userPic:any){
    var commentData ={
      userPicture: userPic,
      userName: userName,
      comment: usercomment,
      sendtime: moment().format("DD-MM-YYYY, h:mm a"),
    };
    
    return this.firedb.list('/project-discussion/'+ projectId).push(commentData);
  
  }

  checkComment(projectKey:any){
    return firebase.database().ref('project-discussion').child(projectKey).once('value');
  }

  checkProject(userID:any){
    return firebase.database().ref('project-lists').child(userID).once('value');
  }
  
  deleteProject(projectKey:any){
    return this.firedb.list('/projects/').remove(projectKey);
  }

  deleteProjectList(project:any){
    var num;
    num =project.projectAssignUid.length;
    for(let i=0;i<num;i++){
      this.firedb.list('/project-lists/'+project.projectAssignUid[i]).remove(project.key);
    }
 
  }

  deleteProjectListAfterUpdate(oldproject:any,projectKey:any){
    var num;
    num =oldproject.projectAssignUid.length;
    
    for(let i=0;i<num;i++){
      this.firedb.list('/project-lists/'+oldproject.projectAssignUid[i]).remove(projectKey);
    }
 
  }
}