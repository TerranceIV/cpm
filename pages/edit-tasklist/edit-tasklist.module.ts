import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditTasklistPage } from './edit-tasklist';

@NgModule({
  declarations: [
    EditTasklistPage,
  ],
  imports: [
    IonicPageModule.forChild(EditTasklistPage),
  ],
})
export class EditTasklistPageModule {}
