import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController ,LoadingController,AlertController} from 'ionic-angular';
import { ProjectDataProvider } from '../../providers/project-data/project-data';
import { UsersDataProvider } from '../../providers/users-data/users-data';
import * as firebase from 'firebase';
import { Camera } from 'ionic-native';
declare var window :any; 

@IonicPage()
@Component({
  selector: 'page-cproject',
  templateUrl: 'cproject.html',
  providers:[ProjectDataProvider,UsersDataProvider]
})

export class CprojectPage {
  
  userPic:any;
  userName:any;
  userList$;
  hide=true;
  fileName="";
  blob:any;
  projectDetails={
    projectTitle: '',
    projectDesc: '',
    assignPeople:'',
    dueDate: '',
    projectStatus:'not complete',
  }
  
  private userId :any;
  // private data_key:any;
  public option ={
    sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
    mediaType: Camera.MediaType.ALLMEDIA, //all file supported 
    destinationType:Camera.DestinationType.FILE_URI //file destination

  }

  constructor(private alertCtrl:AlertController, 
    private loadingCtrl: LoadingController,
    private viewCtrl: ViewController,
    private projectService:ProjectDataProvider,
    private usersService: UsersDataProvider,
    public navCtrl: NavController, 
    public navParams: NavParams) 
    {
        this.userId = firebase.auth().currentUser.uid; //user id of current logged in user
        this.usersService.viewUser(this.userId).then(snapshot => {
          this.userPic= snapshot.val().photo || "assets/icon/people.png";
          this.userName = snapshot.val().username;
        })

        this.userList$ = this.projectService.getUserList()
        .snapshotChanges() //give key and value
        .map(changes =>{   //map the changes of key and value
          return changes.map(c=>({ //return object
            key:c.payload.key,  //return key of the data
            ...c.payload.val() //return value of data
          }))
        });
  }

  pop(){
    this.viewCtrl.dismiss();
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad CprojectPage');
  }

  attachmentUpload(){

    let alert = this.alertCtrl.create({

      title: 'Confirm upload',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Upload',
          handler: () => {

            let loading = this.loadingCtrl.create({
              dismissOnPageChange: true,
              content: 'Saving...'
            });
            loading.present();
            
            Camera.getPicture(this.option).then(fileuri=>{ //get picture then resolve the URL
              window.resolveLocalFileSystemURL("file://"+fileuri,FileEntry=>{
                FileEntry.file(file=>{ 
                  const FR = new FileReader() 
                  FR.onloadend=(res:any)=>{
                    let AF=res.target.result //from arraybuffer convert to blob
                    let blob=new Blob([new Uint8Array(AF)])
                    this.blob=blob;
                    this.fileName=file.name;
                    this.hide=false;
                  };
                  FR.readAsArrayBuffer(file);
        
                })
              })
            }).then(() => {
            
              //add toast
              loading.dismiss().then(() => {
                let alert = this.alertCtrl.create({
                    title: 'file uploaded',
                    buttons: ['OK']
                });
                alert.present();
              })   
          }, error => {
             loading.dismiss().then(() => {
                let alert = this.alertCtrl.create({
                    title: 'Cancel',
                    subTitle: error.message,
                    buttons: ['OK']
                });
              alert.present();
             })   
            });
           
          }
        }
      ]
    });
    alert.present();
  }

  create_project(projectDetails:any){

    if(projectDetails.projectTitle !="" && projectDetails.projectDesc !="" 
    && projectDetails.assignPeople !="" && projectDetails.dueDate !=""){

    //add preloader
    let loading = this.loadingCtrl.create({
      dismissOnPageChange: true,
      content: 'Creating your project..'
    });
    loading.present();
         
    //call the service
    // this.projectService.viewUser(this.userId).then(snapshot=>{
    //   this.data_key = snapshot.val();
    // });
    
 
    this.projectService.createProjectService(this.userId, projectDetails,this.fileName,this.blob,this.userPic,this.userName).then(() => {
      
      
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
          title: 'Error adding new project',
          subTitle: 'Please Fill in all fields!!',
          buttons: ['OK']
        });
        alert.present();  
    }
 
  }

 
}
