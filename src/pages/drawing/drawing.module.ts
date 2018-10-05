import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DrawingPage } from './drawing';

@NgModule({
  declarations: [
    DrawingPage,
  ],
  imports: [
    IonicPageModule.forChild(DrawingPage),
  ],
})
export class DrawingPageModule {}
