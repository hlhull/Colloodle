import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChooseFriendsPage } from './choose-friends';

@NgModule({
  declarations: [
    ChooseFriendsPage,
  ],
  imports: [
    IonicPageModule.forChild(ChooseFriendsPage),
  ],
})
export class ChooseFriendsPageModule {}
