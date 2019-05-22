import { Component } from '@angular/core';
import { IonicPage ,NavController,AlertController} from 'ionic-angular';
import * as firebase from 'firebase';
import { AngularFireDatabase } from 'angularfire2/database';


@IonicPage()
@Component({
  selector: 'page-navigation',
  templateUrl: 'navigation.html',
})

export class NavigationPage {
  
  projectDashboardRoot = 'ProjectDashboardPage';
  workspacelistRoot = 'WorkspacelistPage';
  inboxRoot = 'InboxPage';
  userId:any;
  notiList$;
  inboxNum;
  count:number=1;
  constructor(private firedb:AngularFireDatabase,public navCtrl: NavController,public alertCtrl:AlertController) {

    this.userId = firebase.auth().currentUser.uid;

    this.firedb.list('/notifications/'+this.userId, ref => ref.orderByChild('readState').equalTo("unseen"))
      .snapshotChanges().map(list=>list.length).subscribe(length=>
      {
        this.inboxNum = length;
              
        if(this.inboxNum>=1 && this.count==1){
           
          let alert = this.alertCtrl.create({
                  title: "Notification",
                  subTitle: this.inboxNum + " notifications",
                  message: "Please check with your inbox",
                  buttons: ['Close']
                });
          alert.present();
          
        }
        this.count=2;     
      });

      
  }
}
