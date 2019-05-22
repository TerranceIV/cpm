import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ModalController ,PopoverController,AlertController,ToastController} from 'ionic-angular';
import { ProjectDataProvider } from '../../providers/project-data/project-data';
import { TaskDataProvider } from '../../providers/task-data/task-data'; 
import { UsersDataProvider } from '../../providers/users-data/users-data';

import * as firebase from 'firebase';
import { Observable }from 'rxjs/Observable';
import { ProjectDetails } from './../../model/component.model';
import * as moment from 'moment';


@IonicPage()
@Component({
  selector: 'page-project-dashboard',
  templateUrl: 'project-dashboard.html',
  providers:[ProjectDataProvider,TaskDataProvider,UsersDataProvider]
})
export class ProjectDashboardPage {

  public sortList;
  public userData: any='';
  myDate=moment().format("YYYY-MM-DD");
  check:boolean;
  userPic;
  userName;

  projectList$:Observable<ProjectDetails[]>;

  constructor(
    public Toast:ToastController,
    private alertCtrl:AlertController, 
    private usersService: UsersDataProvider,
    private projectService:ProjectDataProvider,
    private taskService: TaskDataProvider,
    public popoverCtrl: PopoverController,
    public modalCtrl: ModalController,
    public navCtrl: NavController, public navParams: NavParams) {

      this.userData = firebase.auth().currentUser;

      this.usersService.viewUser(this.userData.uid).then(snapshot => {
        this.userPic= snapshot.val().photo || "assets/icon/people.png";
        this.userName = snapshot.val().username;
      })

      this.projectList$ = this.projectService.getProjectlist(this.userData.uid)
      .snapshotChanges() //give key and value
      .map(changes =>{   //map the changes of key and value
        return changes.map(c=>({ //return object
          key:c.payload.key,  //return key of the data
          ...c.payload.val()//return value of data              
        })) 
      })
   
      this.projectService.checkProject(this.userData.uid).then(snapshot => {
        
        if(snapshot.val()==null){
          this.check=true;
        }else{
          this.check=false;
        }
      }) 
  }

  doRefresh(refresher:any){

    setTimeout(() => {
      refresher.complete();
    });
  }; 

  editProject1(project:any){

    if(firebase.auth().currentUser.uid==project.projectOwner){

      let alert1 = this.alertCtrl.create();
      alert1.setTitle('Change Project Status!');
  
      alert1.addInput({
          type: 'radio',
          label: 'completed',
          value: 'completed',
          checked: true
        });
  
        alert1.addInput({
          type: 'radio',
          label: 'not complete',
          value: 'not complete'
        });
        alert1.addButton('Cancel');
        alert1.addButton({
          text: 'Ok',
          handler: (data: any) => {
            alert1.present();
            // console.log('project data:', project.key);
            this.projectService.updateProjectStatus(project,data,this.userData.uid,this.userPic,this.userName);
            // console.log('Radio data:', data);
          }
        });
        
  
      let alert = this.alertCtrl.create();
  
        alert.setTitle('Which option you choose?');
        alert.addButton({
          text: 'Set Project Status',
          handler: (data: any) => {
            alert1.present();
          }
        });
        alert.addButton({
          text: 'Edit Project Detail',
          handler: (data: any) => {
            let projectData ={
              projectData:project
            }
  
            this.navCtrl.push('EditprojectPage',projectData);
          }
        });
        alert.addButton({
          text: 'Remove this Project',
          handler: (data: any) => {
            this.delProject(project);
          }
        });
        alert.addButton('Cancel');
  
        alert.present();
    }else{
      let alert = this.alertCtrl.create();
      alert.setTitle('You have not permission to edit this project.');
      alert.addButton('OK');
      alert.addButton('Cancel');
      alert.present();
    }
   
  }

  delProject(project:any){

    let alert = this.alertCtrl.create({
      title: `Confirm delete ${project.projectTitle} ?`,
      message: 'The action will not be undo after deleted',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Delete',
          handler: () => {
            this.projectService.deleteProjectList(project);
            this.projectService.deleteProject(project.key);
            // this.taskService.deleteTaskAfterprojectdel(project.key);
            this.taskService.deleteTaskListAfterprojectdel(project.key)
            .then(()=>{
              let toast = this.Toast.create({
                message: `${project.projectTitle}! is removed!`,
                duration: 1500,
                position: 'top'
              });
              toast.present();
            })
            console.log('Delete clicked');
          }
        }
      ]
    });
    alert.present();

  }


  open_userprofile(){
    const profile= this.modalCtrl.create('ProfilePage');
    profile.present();
  }

  presentSort(myEvent){
  
    //event is important to set the location of popover   
    let popover = this.popoverCtrl.create('ProjectSortPage');
    popover.present({
      ev: myEvent 
    });

    popover.onDidDismiss(data => {
      console.log(data);
      if(data!=null){
        this.projectList$ = data
      }
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProjectDashboardPage');
    
  }
  
  
  
}
