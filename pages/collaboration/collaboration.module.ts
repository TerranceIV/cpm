import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CollaborationPage } from './collaboration';

@NgModule({
  declarations: [
    CollaborationPage,
  ],
  imports: [
    IonicPageModule.forChild(CollaborationPage),
  ],
})
export class CollaborationPageModule {}
