import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,ToastController ,AlertController} from 'ionic-angular';
import { Observable }from 'rxjs/Observable';
import { TaskDataProvider } from '../../providers/task-data/task-data'; 
import { ProjectDetails } from './../../model/component.model';
import { ProjectDataProvider } from '../../providers/project-data/project-data';
import firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-edit-tasklist',
  templateUrl: 'edit-tasklist.html',
  providers:[TaskDataProvider]
})
export class EditTasklistPage {

  Datatask={
    taskKey:'',
    taskTitle:'',
    taskDescription:'',
    taskStatus:'',
    taskAssign:'',
    taskDueDate:''
  };

  private userId =firebase.auth().currentUser.uid;
  projectList$:Observable<ProjectDetails[]>;
  private passedData;
  private projectId='';
  private newprojectId='';

  constructor(private alertCtrl:AlertController, 
    private toastCtrl:ToastController,
    private projectService: ProjectDataProvider,
    private taskService: TaskDataProvider,
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

  update_task(task:any){

    console.log(task);
    if(this.Datatask.taskTitle !="" && this.Datatask.taskDescription !="" && this.Datatask.taskStatus !="" && this.Datatask.taskDueDate !="" && this.newprojectId !=""){
      this.taskService.updateTask(task,this.newprojectId,this.projectId).then(()=>{
        // this.navCtrl.pop();
        this.navCtrl.setRoot('NavigationPage');
        let toast = this.toastCtrl.create({
          message: 'Task updated...',
          duration: 1500,
          position: 'top'
        });
        toast.present();
      })
    }else{
            
      let alert = this.alertCtrl.create({
        title: 'Error editing  new task',
        subTitle: 'Please Fill in all fields!!',
        buttons: ['OK']
      });
      alert.present();  
  }
    
    
  }

  ionViewDidLoad() {
    this.passedData = this.navParams.get('projectTask'); //first page
    console.log('ionViewDidLoad EditTasklistPage',this.passedData);
    
    this.Datatask.taskKey=this.passedData.key;
    this.Datatask.taskTitle=this.passedData.taskTitle;
    this.Datatask.taskAssign=this.passedData.taskAssign;
    this.Datatask.taskDescription=this.passedData.taskDescription;
    this.Datatask.taskStatus=this.passedData.taskStatus;
    this.Datatask.taskDueDate=this.passedData.taskDueDate;

    this.taskService.viewtaskService(this.passedData.key).then(snapshot => {
      
      this.projectId = snapshot.val().projectId; 
      console.log('Specify task !'+ this.projectId);
    })
   
  }

}
