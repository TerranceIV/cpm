import { Component } from '@angular/core';
import { IonicPage, NavController ,ToastController, LoadingController} from 'ionic-angular';
import { UsersDataProvider } from '../../providers/users-data/users-data';
import * as firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-default',
  templateUrl: 'default.html',
  providers:[UsersDataProvider]
})
export class DefaultPage {
  
  user;
  constructor(private loadingCtrl: LoadingController,
    private toastCtrl:ToastController,
    private usersService:UsersDataProvider,
    public navCtrl: NavController ) {
  }

 
  ionViewDidLoad() {
    console.log('ionViewDidLoad DefaultPage');
  }

  Login(){
    this.navCtrl.push('LoginPage');
  }

  Register(){
    this.navCtrl.push('RegisterPage');
  }

  googleSignIn(){    
    let loader = this.loadingCtrl.create({
    dismissOnPageChange: true,
    content:"Please Waiting..."
    });
    loader.present();

    setTimeout(() => {
      loader.dismiss();
    }, 3000);

    this.usersService.googleSignInUser().then(()=>{
      //success, redirect
      this.user=firebase.auth().currentUser;

      if( this.user==null|| this.user==undefined){
        let toast = this.toastCtrl.create({
          message: 'Error',
          duration: 1000,
          position: 'top'
        });
        toast.present();
      }else{
        let toast = this.toastCtrl.create({
          message: 'Account logged...',
          duration: 1000,
          position: 'top'
        });
        toast.present();
      }
      this.navCtrl.setRoot('NavigationPage');
      
    })
      
  }

 
}
