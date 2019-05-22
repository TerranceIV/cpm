import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TasklistPage } from './tasklist';

@NgModule({
  declarations: [
    TasklistPage,
  ],
  imports: [
    IonicPageModule.forChild(TasklistPage),
  ],
})
export class TasklistPageModule {}
