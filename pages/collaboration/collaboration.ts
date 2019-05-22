import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController ,PopoverController,LoadingController,AlertController} from 'ionic-angular';
import { ProjectDataProvider } from '../../providers/project-data/project-data';
import { UsersDataProvider } from '../../providers/users-data/users-data';
import * as firebase from 'firebase'
// import { AngularFireDatabase } from 'angularfire2/database';
import { Camera, CameraOptions } from '@ionic-native/camera';
import * as moment from 'moment';

declare var window :any; 

@IonicPage()
@Component({
  selector: 'page-collaboration',
  templateUrl: 'collaboration.html',
  providers:[ProjectDataProvider,UsersDataProvider]
})
export class CollaborationPage {
  
  selectedPhoto;
  loading;
  currentImage;
  filename;
  myDate=moment().format("YYYY-MM-DD");
  checkComment:boolean;
  userID;
  private userPic: any;
  public usercomment: any="";
  public userName:any;
  public project:any;

  projectDetails={
    projectTitle:'',
    projectDescription:'',
    projectAssign:'',
    projectDueDate:''
  }
  public option ={
    sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,
    mediaType: this.camera.MediaType.ALLMEDIA, //all file supported 
    destinationType: this.camera.DestinationType.FILE_URI //file destination

  }
  fileName="";
  blob:any;
  projectComment$;

  constructor(
    public alertCtrl:AlertController,
    public loadingCtrl:LoadingController,
    public camera: Camera,
    public popoverCtrl: PopoverController,
    private viewCtrl : ViewController,
    private usersService: UsersDataProvider,
    private projectService:ProjectDataProvider,
    public navCtrl: NavController, 
    public navParams: NavParams) {

    
    this.userID = firebase.auth().currentUser.uid; //current user id

    this.displayUser();

    this.project = this.navParams.get('projects'); //first page
    console.log('ionViewDidLoad CollaborationPage');
    
    //Assign the object obtain from the previous page into the local variable in this page
    this.projectDetails.projectTitle=this.project.projectTitle;
    this.projectDetails.projectDescription=this.project.projectDescription;
    this.projectDetails.projectAssign=this.project.projectAssign;
    this.projectDetails.projectDueDate=this.project.projectDueDate;

    this.projectComment$ = this.projectService.getCommentlist(this.project.key)
    .snapshotChanges() //give key and value
    .map(changes =>{  //map the changes of key and value
      return changes.map(c=>({ //return object
        key:c.payload.key,  //return key of the data
        ...c.payload.val() //return value of data

      }))
    })

      this.projectService.checkComment(this.project.key).then(snapshot => {
          if(snapshot.val()==null){
            this.checkComment=true;
          }else{
            this.checkComment=false;
          }
      }) 
  
  }

  selectionGrabPicture(){
    let alert = this.alertCtrl.create();

    alert.setTitle('Which option you choose?');
    alert.addButton({
      text: 'Capture photo',
      handler: (data: any) => {
        this.grabPicture();
      }
    });
    alert.addButton({
      text: 'From Local picture folder',
      handler: (data: any) => {
        this.grabPicture2();
      }
    });
    
    alert.addButton('Cancel');
    alert.present();
  }

  grabPicture() {

    const options: CameraOptions = {
      quality: 100,
      targetHeight: 400,
      targetWidth: 400,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation:true,
    }

    this.camera.getPicture(options).then((imageData) => {
      this.loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });
      this.loading.present();

      this.selectedPhoto  = this.dataURItoBlob('data:image/jpeg;base64,' + imageData);

      this.upload();
    }, (err) => {
      console.log('error', err);
    });
  }

  grabPicture2() {

    const options2: CameraOptions = {
      quality: 100,
      targetHeight: 400,
      targetWidth: 400,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation:true,
      sourceType:this.camera.PictureSourceType.PHOTOLIBRARY
    }

    

    this.camera.getPicture(options2).then((imageData) => {
      this.loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });
      this.loading.present();

      this.selectedPhoto  = this.dataURItoBlob('data:image/jpeg;base64,' + imageData);

      this.upload();
    }, (err) => {
      console.log('error', err);
    });
  }

  dataURItoBlob(dataURI) {
    
    // code adapted from: http://stackoverflow.com/questions/33486352/cant-upload-image-to-aws-s3-from-ionic-camera
    let binary = atob(dataURI.split(',')[1]);
    let array = [];
    for (let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
  };

  upload() {
    if (this.selectedPhoto) {

      let prompt = this.alertCtrl.create({
        title: 'Enter a file name for captured picture',
        message: "The uploaded file will be named",
        inputs: [
          {
          name: 'filename',
          placeholder: 'picture1'
          },
        ],
        buttons: [{
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        { text: 'Save',
          handler: data => {
            //add preloader
             let loading = this.loadingCtrl.create({
                dismissOnPageChange: true,
                content: 'Saving...'
              });
              loading.present();
              //call usersservice
              this.filename=data.filename;
              var uploadTask = firebase.storage().ref().child(this.project.key+'/images/'+data.filename).put(this.selectedPhoto);
              uploadTask.then(this.onSuccess, this.onError)
              .then(() => {
                
                  //add toast
                  loading.dismiss().then(() => {
                    let alert = this.alertCtrl.create({
                        title: 'photo uploaded',
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
        }]
      });
      prompt.present();
      
      
    }
  }
  onSuccess = (snapshot) => {
    this.currentImage = snapshot.downloadURL;
    this.sendimage();
    this.loading.dismiss();
    
  }

  onError = (error) => {
    console.log('error', error);
    this.loading.dismiss();
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
            
            this.camera.getPicture(this.option).then(fileuri=>{ //get picture then resolve the URL
              window.resolveLocalFileSystemURL("file://"+fileuri,FileEntry=>{
                FileEntry.file(file=>{ 
                  const FR = new FileReader() 
                  FR.onloadend=(res:any)=>{
                    let AF=res.target.result //from arraybuffer convert to blob
                    let blob=new Blob([new Uint8Array(AF)])
                    this.blob=blob;
                    this.fileName=file.name;
                    this.projectService.uploadFile(this.project.key,blob,this.fileName);
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
                    title: 'Error',
                    subTitle: error.message,
                    buttons: ['OK']
                });
              alert.present();
             })   
            });
            console.log('uploaded');
          }
        }
      ]
    });
    alert.present();

    
  }

  doRefresh(refresher:any){

    setTimeout(() => {
      refresher.complete();
    });
  }; 

  pop(){
    this.viewCtrl.dismiss();
    //this.navCtrl.setRoot('NavigationPage');
  }

  sendimage(){
      this.projectService.createCommentImageService(this.userName,this.currentImage,this.filename,this.project.key,this.userPic);  
      this.checkComment=false;
  }

  sendcomment(){
    if(this.usercomment!=""){
      this.projectService.createCommentService(this.userName,this.usercomment,this.project.key,this.userPic);
      this.usercomment=""; //reset the field 
      this.checkComment=false;
    }
  }

  displayUser(){

    this.usersService.viewUser(this.userID).then(snapshot => {
    this.userPic= snapshot.val().photo || "assets/icon/people.png";
    this.userName = snapshot.val().username;
    })
  }

  presentDocument(myEvent){
    let data ={
      projectKey:this.project.key
    }
    //event is important to set the location of popover
    let popover = this.popoverCtrl.create('DocumentlistPage',data);
    
    popover.present({
      ev: myEvent 
    });
  }

  ionViewDidLoad() {
  }

}