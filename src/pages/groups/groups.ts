import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { GroupManagerProvider } from '../../providers/group-manager/group-manager';
import { FinalPage } from '../final/final';
import { RandomStorageProvider } from '../../providers/image-storage/random-storage';
import firebase from 'firebase';
import { ScreenOrientation } from '@ionic-native/screen-orientation';


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
  storageRef = firebase.storage().ref();
  drawings='Completed';

  constructor(public navCtrl: NavController, public navParams: NavParams, private screenOrientation: ScreenOrientation, private groupManager: GroupManagerProvider, private alertCtrl: AlertController) {
      this.screenOrientation.unlock();
      this.groupManager.resetNew();
      this.setThumnails('Completed');
  }

  /*
    When user clicks on drawing, go to final page and show that group's drawing
  */
  viewGroupDrawing(groupName){
    var imageStorage = new RandomStorageProvider();
    imageStorage.setGroupNum(groupName);
    this.navCtrl.push(FinalPage, {imageStorage: imageStorage}, {animate:false});
  }

  /*
    Loops through the list of groups to set the thumnail for every group the user's in
  */
  setThumnails(list){
    if(list == 'Completed'){
      this.groupManager.completed.forEach((info) => {
        this.assignSrc(info);
      });
    } else {
      this.groupManager.inProgress.forEach((info) => {
        this.assignSrc(info);
      });
    }
  }

  /*
    Assigns the src url of the thumbnail image to the corresponding drawing
  */
  assignSrc(info){
    var group = info['group']; //get group #

    //download image @ correct group and section number
    this.storageRef.child(group).child(info['section']+'.png').getDownloadURL().then(function(url) {
      var img: HTMLElement  = document.getElementById(group);
      img.setAttribute("src", url); //set thumnail image to the downloaded image
    }).catch(function(error) {
      console.log("error", error);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GroupsPage');
  }

  /*
  * Causes an alert/confirmation screen to pop up when delete/trash button is pressed
  */
  presentConfirmDelete(group) {
    let alert = this.alertCtrl.create({
      title: 'Confirm Action',
      message: 'Are you sure you want to delete this drawing? If you delete it, it cannot be recovered.',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.groupManager.deleteGroup(group);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {}
        }
      ]
    });
    alert.present();
  }


}
