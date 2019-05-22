import { Component  } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { UsersDataProvider } from '../../providers/users-data/users-data';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
  providers : [UsersDataProvider]
})
export class RegisterPage {
  regisForm: FormGroup;
  constructor( public formBuilder: FormBuilder,private loadingCtrl: LoadingController, private usersService: UsersDataProvider, private toastCtrl: ToastController,
               public navCtrl: NavController, public navParams: NavParams ) 
    {
      let username = new FormControl('', Validators.compose([Validators.required, Validators.pattern('[a-zA-Z0-9]*'),Validators.minLength(5), Validators.maxLength(30)]) );
      let email = new FormControl('', Validators.compose([Validators.required,CustomValidators.email]) );
      let password = new FormControl('', Validators.compose([Validators.required, Validators.pattern('^.*(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).*$'), Validators.minLength(8)]) );
      let rpassword = new FormControl('', Validators.compose([Validators.required,CustomValidators.equalTo(password)]) );
     
      this.regisForm = formBuilder.group({
        username: username,
        email:email,
        password: password,
        rpassword:  rpassword,
      })
    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  onSubmit(value: any): void{
    let loader = this.loadingCtrl.create({
      dismissOnPageChange: true,
    });
    
    loader.present();
    
    setTimeout(() => {
      loader.dismiss();
    }, 3000);

    if(this.regisForm.valid) {

      this.usersService.register_user(value.email, value.password, value.username);
      this.navCtrl.pop(); 
    }
  }

  googleSignIn(){    
      let loader = this.loadingCtrl.create({
      dismissOnPageChange: true,
      content:"Please Waiting..."
      });
      loader.present();

      this.usersService.googleSignInUser().then(result=>{
        //success, redirect
        if(result==null||result==undefined){
          let toast = this.toastCtrl.create({
            message: 'Error when loggin...',
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

        this.navCtrl.setRoot('NavigationPage', {animate: true, direction: 'forward'});
        
      },error=>{
        this.navCtrl.pop();
        let toast = this.toastCtrl.create({
          message: 'Error when loggin...',
          duration: 1000,
          position: 'top'
        });
        toast.present();
        // this.navCtrl.setRoot('RegisterPage');
      }
    )
        
  }

}