import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams , AlertController, ToastController, LoadingController} from 'ionic-angular';
import { UsersDataProvider } from '../../providers/users-data/users-data';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers : [UsersDataProvider]
})
export class LoginPage {

  public username:any; // should be same with the ngModel value which it is case sensitive
  public email:any;
  public pw:any;

  constructor(private loadingCtrl: LoadingController,private toastCtrl:ToastController,private usersService:UsersDataProvider, public navCtrl: NavController, public navParams: NavParams , public alertCtrl: AlertController) {
    this.email = "";
    this.pw = "";
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  showForgotPassword(){
    
    let prompt = this.alertCtrl.create({
      title: 'Enter Your Email',
      message: "A new password will be sent to your email",
      inputs: [
        {
        name: 'recoverEmail',
        placeholder: 'you@example.com'
        },
      ],
      buttons: [{
        text: 'Cancel',
        handler: data => {
          console.log('Cancel clicked');
        }
      },
      { text: 'Submit',
        handler: data => {
          //add preloader
           let loading = this.loadingCtrl.create({
              dismissOnPageChange: true,
              content: 'Reseting your password..'
            });
            loading.present();
            //call usersservice
            this.usersService.forgotPasswordUser(data.recoverEmail).then(() => {
                //add toast
                loading.dismiss().then(() => {
                  let alert = this.alertCtrl.create({
                      title: 'Check your email',
                      subTitle: 'Password reset successful',
                      buttons: ['OK']
                  });
                  alert.present();
                })   
            }, error => {
               loading.dismiss().then(() => {
                  let alert = this.alertCtrl.create({
                      title: 'Error resetting password',
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

  login(){
    this.usersService.loginUser(this.email, this.pw).then(authData => {
      //successful
      let loader = this.loadingCtrl.create({
        dismissOnPageChange: true,
        content:"Please Waiting..."
      });
      
      loader.present();
      this.navCtrl.setRoot('NavigationPage');
      this.usersService.viewUser(authData.uid).then(snapshot => {

        let toast = this.toastCtrl.create({
          message: `${snapshot.val().username}'`+'s account is logged...',
          duration: 1500,
          position: 'top'
        });
        toast.present();
      }) 
     
    }, 
    error => {
      let alert = this.alertCtrl.create({
        title: 'Error loggin in',
        subTitle: error.message,
        buttons: ['OK']
      });
      alert.present();
      });

  }
}
