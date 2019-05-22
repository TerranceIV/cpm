import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ModalController } from 'ionic-angular';
import { ProjectDataProvider } from '../../providers/project-data/project-data';
import * as firebase from 'firebase'
import { Observable }from 'rxjs/Observable';
import { ProjectDetails } from './../../model/component.model';

@IonicPage()
@Component({
  selector: 'page-workspacelist',
  templateUrl: 'workspacelist.html',
  providers:[ProjectDataProvider]
})
export class WorkspacelistPage {

  projectList$:Observable<ProjectDetails[]>;
  private myUserId;
  // check:boolean;

  constructor(private projectService: ProjectDataProvider,public modalCtrl: ModalController,public navCtrl: NavController, public navParams: NavParams) {
    
    this.myUserId = firebase.auth().currentUser.uid; //current user id
    this.projectList$ = this.projectService.getProjectlist(this.myUserId)
   .snapshotChanges() //give key and value
   .map(changes =>{   //map the changes of key and value
      return changes.map(c=>({ //return object
      key:c.payload.key,  //return key of the data
      ...c.payload.val() //return value of data
      }))
    })
       

    
      // this.projectService.checkProject(this.myUserId).then(snapshot => {
        
      //   if(snapshot.val()==null){
      //     this.check=true;
      //   }else{
      //     this.check=false;
      //   }
      // }) 

  }
  //refresh page
  doRefresh(refresher:any){

    setTimeout(() => {
      refresher.complete();
    });
  };  

  ionViewDidLoad() {
    console.log('ionViewDidLoad WorkspacelistPage');
  }

}
