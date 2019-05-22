import { Injectable } from '@angular/core';
//import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import * as firebase from 'firebase';
import { Platform ,AlertController} from 'ionic-angular';

@Injectable()
export class UsersDataProvider {

  //private data: any;
  public fireAuth: any;
  public userProfile: any;
  public projectData: any;
   
  constructor(public platform:Platform,public alertCtrl: AlertController) {
       
    this.fireAuth = firebase.auth();
    this.userProfile = firebase.database().ref('data_users');
  }
  

  updateProfile(userId:any,userEmail:any, userDisplayname:any,photo:any){
    var updatePath = {};

    var userData ={
      email: userEmail,
      photo: photo,
      username: userDisplayname,
    };

    updatePath['/data_users/' + userId] = userData;
    return firebase.database().ref().update(updatePath);
  }

  viewUser(userId: any){
    var userRef = this.userProfile.child(userId);
    return userRef.once('value'); //help to find the specify id data 
  }

  register_user(email: string , password: string, username:string){
    this.fireAuth.createUserWithEmailAndPassword(email, password)
    .catch(Error=>{
      console.log("error create");
      let alert = this.alertCtrl.create({
        title: "Error",
        subTitle: 'Your account is not valid, email existed!',
        buttons: ['OK']
      });
      return alert.present();
    })
    .then((newUser) => {

          //successful login, create user profile
          this.userProfile.child(newUser.uid).set({
          email: email,
          photo: "assets/icon/people.png",
          username:username,
          });	
        this.fireAuth.signOut();
        let alert = this.alertCtrl.create({
          title: "Success!",
          subTitle: 'Your account is under our system now! Enjoy and login apps!',
          buttons: ['OK']
        });
        alert.present();
    });
  }
  
  loginUser(email: string, password: string): any {
      return this.fireAuth.signInWithEmailAndPassword(email, password);
  }
    
  logoutUser(){
    return this.fireAuth.signOut();
  }
  
  forgotPasswordUser(email: any){
    return this.fireAuth.sendPasswordResetEmail(email);
  }

  googleSignInUser(){
     
    var provider = new firebase.auth.GoogleAuthProvider();  
    provider.addScope('https://www.googleapis.com/auth/plus.login');
    
    var that = this; // to avoid crash where fireauth also using this 

    return firebase.auth().signInWithPopup(provider).then(function(result) {
  
      if (result.user) {
      // The signed-in user info.
        var user = result.user;

      //var res = result.user.displayName.split(" ");
        that.userProfile.child(user.uid).set({
        email: user.email,
        photo: user.photoURL,
        username: user.displayName,

         /*name:{
           first: res[0],
           middle: res[1],
           last: res[2],
        },*/
      });
    }
    })
    .catch(function(error) {
        console.log(error);
    });
   } 
}
