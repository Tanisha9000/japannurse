import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { JobviewPage } from './jobview';

@NgModule({
  declarations: [
    JobviewPage,
  ],
  imports: [
    IonicPageModule.forChild(JobviewPage),
  ],
})
export class JobviewPageModule {}
