import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DrawingModesPage } from './drawing-modes';

@NgModule({
  declarations: [
    DrawingModesPage,
  ],
  imports: [
    IonicPageModule.forChild(DrawingModesPage),
  ],
})
export class DrawingModesPageModule {}
