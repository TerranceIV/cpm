import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController,ToastController } from 'ionic-angular';
import { TaskDataProvider } from '../../providers/task-data/task-data'; 
import { AngularFireDatabase } from 'angularfire2/database';

@IonicPage()
@Component({
  selector: 'page-tasklist',
  templateUrl: 'tasklist.html',
  providers:[TaskDataProvider]
})
export class TasklistPage {

  hide;
  completeItem;
  public projectId:any;
  taskStatus;
  taskList$;
  index;
  check:boolean;
  completePercentage;
  totalItem;
  constructor(private firedb:AngularFireDatabase,
    public Toast:ToastController,
    public alertCtrl:AlertController,
    private taskService: TaskDataProvider,
    public navCtrl: NavController, 
    public navParams: NavParams) {

    //get specific project from previous page 
   
    this.projectId = this.navParams.get('projects'); 
  
    //get the task list based on the project Key 
    this.taskList$ = this.taskService.getTasklist(this.projectId.key)
    .snapshotChanges() //give key and value
    .map(changes =>{   //map the changes of key and value
      return changes.map(c=>({ //return object
        key:c.payload.key,  //return key of the data
        ...c.payload.val() //return value of data
      }))
    })

    this.firedb.list('/task-lists/'+this.projectId.key,ref => ref.orderByChild('taskStatus').equalTo("completed"))
    .snapshotChanges().map(list=>list.length)
    .subscribe(length=>
      {
        this.completeItem = length; //get the total number of completed task
        // console.log("How many completed : "+this.completeItem );
        this.completePercentage = (100*this.completeItem);  

        this.firedb.list('/task-lists/'+this.projectId.key)
        .snapshotChanges().map(list=>list.length)
        .subscribe(length=>
        {
          this.totalItem = length;
          // console.log("Total Item : "+this.totalItem);
          this.completePercentage = this.completePercentage/this.totalItem; //get the total completed percentage
          this.completePercentage = this.completePercentage.toFixed(2);
        });
      });
    
     
      
    this.taskService.checkTask(this.projectId.key).then(snapshot => {
      if(snapshot.val()==null){
        this.check=true;
      }else{
        this.check=false;
      }
    }) 
    
  }
  //refresh page
  doRefresh(refresher:any){

    setTimeout(() => {
      
      refresher.complete();
    });
  }; 

  infoTask(task:any,index:any){
  
    let alert = this.alertCtrl.create({
      title: task.taskTitle,
      subTitle: "Person in charge ："　+　task.taskAssign,
      message: "Due Date ："　+　task.taskDueDate +"<br>"+ "Task Status ："　+　task.taskStatus,
      buttons: ['Close']
    });
    alert.present();
  }

  delTask(task:any){
    console.log(task.key);
    let alert = this.alertCtrl.create({
      title: `Confirm delete ${task.taskTitle} ?`,
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
            this.taskService.deleteTask(task.key);
            this.taskService.deleteTaskList(this.projectId.key,task.key).then(()=>{
              let toast = this.Toast.create({
                message: `${task.taskTitle}! is removed!`,
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
  
  ionViewDidLoad() {
 
    console.log('ionViewDidLoad TasklistPage');
   
  }
}
