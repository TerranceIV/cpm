import { Component } from '@angular/core';
import { IonicPage,NavController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {


  }

  Linkdefault(){
    //the function name should be in capital letter
    this.navCtrl.push('DefaultPage');
  }
}
