import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WorkspacelistPage } from './workspacelist';

@NgModule({
  declarations: [
    WorkspacelistPage,
  ],
  imports: [
    IonicPageModule.forChild(WorkspacelistPage),
  ],
})
export class WorkspacelistPageModule {}
