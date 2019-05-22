import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomePage } from './home';
import { ComponentsModule } from  '../../components/components.module'; //example to import shared components 

@NgModule({
  declarations: [
    HomePage,
  ],
  imports: [
    IonicPageModule.forChild(HomePage),
    ComponentsModule
  ],
})
export class HomePageModule{}
