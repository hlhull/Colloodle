import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { GroupManagerProvider } from '../../providers/group-manager/group-manager';
import { FinalPage } from '../final/final';


/**
 * Generated class for the GroupsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-groups',
  templateUrl: 'groups.html',
})
export class GroupsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private groupManager: GroupManagerProvider) {
  }

  seeGroup(groupName){
    console.log("got it");
    var imgStorage = this.groupManager.getGroupImages(groupName);
    this.navCtrl.push(FinalPage, {imageStorage: imgStorage}, {animate:false});
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GroupsPage');
  }

}
