import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,ModalController,LoadingController,AlertController } from 'ionic-angular';
import * as firebase from 'firebase'
import { UsersDataProvider } from '../../providers/users-data/users-data';
import { Camera, CameraOptions } from '@ionic-native/camera';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
  providers:[UsersDataProvider]
})


export class ProfilePage {

  selectedPhoto;
  loading;
  filename;
  myUserId;
  private userEmail: any='';
  private userDisplayName: any='';
  private userPic: any='';

  constructor(public alertCtrl:AlertController,public camera: Camera,public loadingCtrl:LoadingController,public toastCtrl: ToastController,private usersService: UsersDataProvider,public modalCtrl: ModalController,public navCtrl: NavController, public navParams: NavParams) {
  
    this.myUserId = firebase.auth().currentUser.uid ; //current user id
    
    this.usersService.viewUser(this.myUserId).then(snapshot => {
      
      this.userEmail = snapshot.val().email; 
      this.userDisplayName = snapshot.val().username; 
      this.userPic= snapshot.val().photo || "assets/icon/people.png"; //it will display account pic or default page as set
    })
  }
  
  UploadPic() {

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
              var uploadTask = firebase.storage().ref().child(firebase.auth().currentUser.uid+'/images/'+data.filename).put(this.selectedPhoto);
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
    this.userPic = snapshot.downloadURL;
    this.usersService.updateProfile(this.myUserId,this.userEmail,this.userDisplayName,this.userPic);

  }

  onError = (error) => {
    console.log('error', error);
    this.loading.dismiss();
  }



  logout(){
    this.usersService.logoutUser().then(()=>{
      let loader = this.loadingCtrl.create({
        dismissOnPageChange: true,
        duration:1000
      });
      
      loader.present();
      this.navCtrl.setRoot('DefaultPage'); //this used to redirect to default page by removing the tabs
      let toast = this.toastCtrl.create({
        message: 'User logout...',
        duration: 1000,
        position: 'top'
      });
      toast.present();

    });
  }
  pop_back(){
    this.navCtrl.pop();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

}
