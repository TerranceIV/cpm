import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController } from 'ionic-angular';
import { ProjectDataProvider } from '../../providers/project-data/project-data';
import * as firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-inboxsort',
  templateUrl: 'inboxsort.html',
})
export class InboxsortPage {

  userId:any;
  notiList$;

  constructor( public viewCtrl: ViewController,
    private projectService:ProjectDataProvider,
    public navCtrl: NavController, 
    public navParams: NavParams) {
      this.userId = firebase.auth().currentUser.uid;
  }

  sortclear(){
    this.notiList$ = this.projectService.getNotiList(this.userId)
    .snapshotChanges() //give key and value
    .map(changes =>{   //map the changes of key and value
      return changes.map(c=>({ //return object
        key:c.payload.key,  //return key of the data
        ...c.payload.val()//return value of data   
      }))
    })
    let data =  this.notiList$;
    this.viewCtrl.dismiss(data);
  }

  sortSeen(){
    this.notiList$ = this.projectService.getNotiListSeen(this.userId)
    .snapshotChanges() //give key and value
    .map(changes =>{   //map the changes of key and value
      return changes.map(c=>({ //return object
        key:c.payload.key,  //return key of the data
        ...c.payload.val()//return value of data   
      }))
    })
    let data =  this.notiList$;
    this.viewCtrl.dismiss(data);
  }

  sortUnseen(){
    this.notiList$ = this.projectService.getNotiListUnseen(this.userId)
    .snapshotChanges() //give key and value
    .map(changes =>{   //map the changes of key and value
      return changes.map(c=>({ //return object
        key:c.payload.key,  //return key of the data
        ...c.payload.val()//return value of data   
      }))
    })
    let data =  this.notiList$;
    this.viewCtrl.dismiss(data);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InboxsortPage');
  }

}
