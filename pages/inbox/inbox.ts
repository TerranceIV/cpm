import { Component } from '@angular/core';
import { IonicPage, NavController,AlertController,PopoverController , ToastController} from 'ionic-angular';
import { ProjectDataProvider } from '../../providers/project-data/project-data';
import * as firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-inbox',
  templateUrl: 'inbox.html',
  providers:[ProjectDataProvider]
})
export class InboxPage {

  userId:any;
  notiList$;
  constructor(public Toast:ToastController,public popoverCtrl: PopoverController,private projectService:ProjectDataProvider,public alertCtrl:AlertController,public navCtrl: NavController) {
    
  
    this.userId = firebase.auth().currentUser.uid; //user id of current logged in user
        
    this.notiList$ = this.projectService.getNotiList(this.userId)
    .snapshotChanges() //give key and value
    .map(changes =>{   //map the changes of key and value
      return changes.map(c=>({ //return object
        key:c.payload.key,  //return key of the data
        ...c.payload.val()//return value of data              
      })) 
    })
  
  }
  doRefresh(refresher:any){

    setTimeout(() => {
      refresher.complete();
    });
  }; 

  delNoti(noti:any){

    let alert = this.alertCtrl.create({
      title: `Confirm delete this notification ?`,
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

            this.projectService.deleteNoti(noti.key,this.userId)
            .then(()=>{
              let toast = this.Toast.create({
                message: `${noti.projectTitle}! is removed!`,
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

  seenNoti(notificationData:any){

    let alert = this.alertCtrl.create({
      title: notificationData.projectTitle,
      // subTitle: ,
      message: "About : "　+notificationData.message +"<br>"+ "Time ："　+ notificationData.sendTime,
      buttons: ['Close']
    });
    alert.present();

    this.projectService.updateNotiList(this.userId,notificationData);
  }

  presentSort(myEvent){
 
    //event is important to set the location of popover   
    let popover = this.popoverCtrl.create('InboxsortPage');
    popover.present({
      ev: myEvent 
    });
  
    popover.onDidDismiss(data => {
      if(data!=null){
         this.notiList$ = data
      }
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InboxPage');
  }

}
