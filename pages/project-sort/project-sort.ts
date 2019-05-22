import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,ViewController } from 'ionic-angular';
import * as firebase from 'firebase'
import { ProjectDataProvider } from '../../providers/project-data/project-data';
import { Observable }from 'rxjs/Observable';
import { ProjectDetails } from './../../model/component.model';

@IonicPage()
@Component({
  selector: 'page-project-sort',
  templateUrl: 'project-sort.html',
  providers:[ProjectDataProvider]
})
export class ProjectSortPage {

  private userData;
  projectList$:Observable<ProjectDetails[]>;

  constructor( public viewCtrl: ViewController,private projectService:ProjectDataProvider,public navCtrl: NavController, public navParams: NavParams) {
    this.userData = firebase.auth().currentUser;
  }

  sortclear(){
    this.projectList$ = this.projectService.getProjectlist(this.userData.uid)
    .snapshotChanges() //give key and value
    .map(changes =>{   //map the changes of key and value
      return changes.map(c=>({ //return object
        key:c.payload.key,  //return key of the data
        ...c.payload.val()//return value of data   
      }))
    })
    let data =  this.projectList$;
    this.viewCtrl.dismiss(data);
  }

  sortTitle(){
    this.projectList$ = this.projectService.getProjectlistbyTitle(this.userData.uid)
    .snapshotChanges() //give key and value
    .map(changes =>{   //map the changes of key and value
      return changes.map(c=>({ //return object
        key:c.payload.key,  //return key of the data
        ...c.payload.val()//return value of data
      }))
    })

    let data =  this.projectList$;
    this.viewCtrl.dismiss(data);
  }

  sortDuedate(){
    this.projectList$ = this.projectService.getProjectlistbyDate(this.userData.uid)
    .snapshotChanges() //give key and value
    .map(changes =>{   //map the changes of key and value
      return changes.map(c=>({ //return object
        key:c.payload.key,  //return key of the data
        ...c.payload.val()//return value of data
      }))
    })
    let data =  this.projectList$;
    this.viewCtrl.dismiss(data);
 
  }

  sortDuedateToday(){
    this.projectList$ = this.projectService.getProjectlistbyTodayDate(this.userData.uid)
            .snapshotChanges() //give key and value
            .map(changes =>{   //map the changes of key and value
              return changes.map(c=>({ //return object
                key:c.payload.key,  //return key of the data
                ...c.payload.val()//return value of data    
      }))
    })
    let data =  this.projectList$;
    this.viewCtrl.dismiss(data);
  
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ProjectSortPage');
  }

}
