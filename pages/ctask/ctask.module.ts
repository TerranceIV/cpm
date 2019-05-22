import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CtaskPage } from './ctask';

@NgModule({
  declarations: [
    CtaskPage,
  ],
  imports: [
    IonicPageModule.forChild(CtaskPage),
  ],
})
export class CtaskPageModule {}
