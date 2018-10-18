//TODO: MIGRATE OR DELETE!
//IF MIGRAE: copy and paste to drawing.module.ts, REMOVE ALL INSTANCES OF THE WORD "landscape"
//IF DELETE: delete all drawing-landscape files, the references to this class in home.html and home.ts and app.module.ts

import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DrawingLandscapePage } from './drawing-landscape';



@NgModule({
  declarations: [
    DrawingLandscapePage,
  ],
  imports: [
    IonicPageModule.forChild(DrawingLandscapePage),
  ],
})
export class DrawingLandscapePageModule {}
