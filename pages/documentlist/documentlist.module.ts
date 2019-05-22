import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DocumentlistPage } from './documentlist';

@NgModule({
  declarations: [
    DocumentlistPage,
  ],
  imports: [
    IonicPageModule.forChild(DocumentlistPage),
  ],
})
export class DocumentlistPageModule {}
