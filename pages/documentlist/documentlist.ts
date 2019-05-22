import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as firebase from 'firebase';
import { ProjectDataProvider } from '../../providers/project-data/project-data';
import { ImageViewerController  } from 'ionic-img-viewer';


@IonicPage()
@Component({
  selector: 'page-documentlist',
  templateUrl: 'documentlist.html',
  providers:[ProjectDataProvider]
})
export class DocumentlistPage {

  projectDoc$;
  projectImage$;
  projectKey;
  dlUrl;
  uploaded: string = "Files";
  _imageViewerCtrl: ImageViewerController;
  constructor(imageViewerCtrl: ImageViewerController,private projectService:ProjectDataProvider,public navCtrl: NavController, public navParams: NavParams) {
    
    this._imageViewerCtrl = imageViewerCtrl;
    this.projectKey = this.navParams.get('projectKey'); //first page
    console.log( "retrieve project ID "+this.projectKey);

    this.projectDoc$ = this.projectService.getProjectDoc(this.projectKey)
    .snapshotChanges() //give key and value
    .map(changes =>{   //map the changes of key and value
      return changes.map(c=>({ //return object
        key:c.payload.key,  //return key of the data
        ...c.payload.val() //return value of data

      }))
    })
    
    this.projectImage$ = this.projectService.getProjectImage(this.projectKey)
    .snapshotChanges() //give key and value
    .map(changes =>{   //map the changes of key and value
      return changes.map(c=>({ //return object
        key:c.payload.key,  //return key of the data
        ...c.payload.val() //return value of data

      }))
    })
    
    
  }

  getURL(urlpath:any){
    firebase.storage().ref().child(urlpath).getDownloadURL().then(url=>{
      this.dlUrl=url;
      //window.location.href = this.dlUrl;
      var mywindow=window.open(this.dlUrl, "_self", 'location=yes');
      setTimeout(() => mywindow.close(), 1000);
    });
    
  }

  presentImage(myImage) {
    const imageViewer = this._imageViewerCtrl.create(myImage);
    imageViewer.present();

    // setTimeout(() => imageViewer.dismiss(), 1000);
    // imageViewer.onDidDismiss(() => alert('Viewer dismissed'));
  }
  

  ionViewDidLoad() {
    console.log('ionViewDidLoad DocumentlistPage',);
  }

}
