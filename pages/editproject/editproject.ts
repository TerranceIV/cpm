import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,LoadingController,AlertController} from 'ionic-angular';
import { ProjectDataProvider } from '../../providers/project-data/project-data';
import * as firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-editproject',
  templateUrl: 'editproject.html',
  providers:[ProjectDataProvider]
})
export class EditprojectPage {

  userId;
  projectData={
    projectKey:'',
    projectTitle:'',
    projectAssign:'',
    projectAssignUid:'',
    projectDescription:'',
    projectStatus:'',
    projectDueDate:'',
  };
  getData:any;
  userList$;
  oldProject;

  constructor(private projectService:ProjectDataProvider,
    private alertCtrl:AlertController, 
    private loadingCtrl: LoadingController,
    public navCtrl: NavController, public navParams: NavParams) {

    this.userId = firebase.auth().currentUser.uid;

    this.getData = this.navParams.get('projectData'); //first page
    console.log( "retrieve project ID "+this.getData.projectAssignUid);

    this.projectData.projectKey=this.getData.key;
    this.projectData.projectTitle=this.getData.projectTitle;
    this.projectData.projectAssign=this.getData.projectAssign;
    this.projectData.projectAssignUid=this.getData.projectAssignUid;
    this.projectData.projectDescription=this.getData.projectDescription;
    this.projectData.projectStatus=this.getData.projectStatus;
    this.projectData.projectDueDate=this.getData.projectDueDate;

    this.userList$ = this.projectService.getUserList()
      .snapshotChanges() //give key and value
      .map(changes =>{   //map the changes of key and value
        return changes.map(c=>({ //return object
          key:c.payload.key,  //return key of the data
          ...c.payload.val() //return value of data
        }))
      });
    
    this.projectService.viewProjectService(this.projectData.projectKey).then(snapshot => {
      
      this.oldProject = snapshot.val(); 
    })

  }

  edit_project(projectDetails:any){

    if(this.projectData.projectTitle !="" && this.projectData.projectAssignUid!="" 
    && this.projectData.projectDescription !="" && this.projectData.projectDueDate !=""){

    // console.log("after submit ", this.projectData.projectAssignUid,projectDetails);
    //add preloader
    let loading = this.loadingCtrl.create({
      dismissOnPageChange: true,
      content: 'Updating your project..'
    });
    loading.present();
         
    
    this.projectService.UpdatingProjectService(this.userId, projectDetails,this.oldProject).then(() => {
      
      
    loading.dismiss().then(() => {
      //show pop up
      let alert = this.alertCtrl.create({
        title: 'Done!',
        subTitle: 'Update successful',
        buttons: ['OK']
      });
      alert.present();
      })
      this.navCtrl.pop();
    // this.navCtrl.setRoot('NavigationPage');

    }, 
    error => {
        //show pop up
        loading.dismiss().then(() => {
        let alert = this.alertCtrl.create({
          title: 'Error when editing project',
          subTitle: error.message,
          buttons: ['OK']
        });
        alert.present();
        })     
    });
    
    }else{
      
        let alert = this.alertCtrl.create({
          title: 'Error when editing project',
          subTitle: 'Please Fill in all fields!!',
          buttons: ['OK']
        });
        alert.present();  
    }
 
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditprojectPage');
  }

}
