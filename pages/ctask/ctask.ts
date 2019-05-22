import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController,AlertController } from 'ionic-angular';
import { ProjectDataProvider } from '../../providers/project-data/project-data';
import { TaskDataProvider } from '../../providers/task-data/task-data'; 
import { Observable }from 'rxjs/Observable';
import { ProjectDetails } from './../../model/component.model';
import firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-ctask',
  templateUrl: 'ctask.html',
  providers:[ProjectDataProvider,TaskDataProvider]
})
export class CtaskPage {
 
  private taskTitle='';
  private taskDesc='';
  private taskassignPeople='';
  private taskdueDate='';
  private taskStatus="not complete";
  private projectKey='';
  
  private userId =firebase.auth().currentUser.uid; ;
  
  
  projectList$:Observable<ProjectDetails[]>;
  
    constructor(private taskService: TaskDataProvider,
      private alertCtrl:AlertController, 
      private loadingCtrl: LoadingController,
      private projectService: ProjectDataProvider,
      public navCtrl: NavController, 
      public navParams: NavParams) {

      this.projectList$ = this.projectService.getProjectlist(this.userId)
      .snapshotChanges() //give key and value
      .map(changes =>{   //map the changes of key and value
        return changes.map(c=>({ //return object
          key:c.payload.key,  //return key of the data
          ...c.payload.val() //return value of data
        }))
      })
      
    }



    create_task(){
      
          if(this.taskTitle !="" && this.taskDesc !="" && this.taskassignPeople !="" && this.taskdueDate !="" && this.projectKey !=""){
          //add preloader
          let loading = this.loadingCtrl.create({
            dismissOnPageChange: true,
            content: 'Creating your task..'
          });
          loading.present();
               
          //call the service
          this.taskService.createTaskService(this.userId, this.taskTitle,this.taskDesc,this.taskassignPeople,this.taskdueDate,this.taskStatus,this.projectKey ).then(() => {
        
          loading.dismiss().then(() => {
            //show pop up
            let alert = this.alertCtrl.create({
              title: 'Done!',
              subTitle: 'Create successful',
              buttons: ['OK']
            });
            alert.present();
            })
        
          this.navCtrl.setRoot('NavigationPage');
          }, 
          error => {
              //show pop up
              loading.dismiss().then(() => {
              let alert = this.alertCtrl.create({
                title: 'Error adding new project',
                subTitle: error.message,
                buttons: ['OK']
              });
              alert.present();
              })     
          });
          
          }else{
            
              let alert = this.alertCtrl.create({
                title: 'Error adding new task',
                subTitle: 'Please Fill in all fields!!',
                buttons: ['OK']
              });
              alert.present();  
          }
       
        }

  
  ionViewDidLoad() {
    console.log('ionViewDidLoad CtaskPage');
  }

}
