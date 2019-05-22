import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProjectDashboardPage } from './project-dashboard';

@NgModule({
  declarations: [
    ProjectDashboardPage,
  ],
  imports: [
    IonicPageModule.forChild(ProjectDashboardPage),
  ],
})
export class ProjectDashboardPageModule {}
