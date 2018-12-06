import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { GroupManagerProvider } from '../../providers/group-manager/group-manager';
import { FriendsStorageProvider } from '../../providers/image-storage/friends-storage';
import { DrawingPage } from '../drawing/drawing';
import { ScreenOrientation } from '@ionic-native/screen-orientation';

/**
 * Generated class for the FriendsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-friends',
  templateUrl: 'friends.html',
})
export class FriendsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private groupManager: GroupManagerProvider, private screenOrientation: ScreenOrientation) {
    this.screenOrientation.unlock();
  }

  drawGroup(group, conflict){
    if(!conflict){
      var imageStorage = new FriendsStorageProvider(group);
      this.navCtrl.push(DrawingPage, {imageStorage: imageStorage}, {animate:false});
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FriendsPage');
  }

}
