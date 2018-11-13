import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { GroupManagerProvider } from '../../providers/group-manager/group-manager';
import { FinalPage } from '../final/final';
import { NetworkStorageProvider } from '../../providers/image-storage/network-storage';
import firebase from 'firebase';


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

  constructor(public navCtrl: NavController, public navParams: NavParams, private groupManager: GroupManagerProvider) {
    this.groupManager.done.then(() => { //once the user's groups have been assigned
      this.setThumnails(); // set the thumbnails
    });
  }

  /*
    When user clicks 'view', go to final page and show that group's drawing
  */
  viewGroupDrawing(groupName){
    var imageStorage = new NetworkStorageProvider();
    imageStorage.setGroupNum(groupName);
    this.navCtrl.push(FinalPage, {imageStorage: imageStorage}, {animate:false});
  }

  /*
    Get the section name to show on screen from the section number
  */
  getSectionName(sectionNum){
    switch(sectionNum){
      case 0:
        return "Head";
      case 1:
        return "Torso";
      case 2:
        return "Legs";
    }
  }

  /*
    Loops through the group lists to set the thumnail for every group the user's in
  */
  setThumnails(){
    this.groupManager.inProgress.forEach((info) => {
      this.assignSrc(info);
    });

    this.groupManager.completed.forEach((info) => {
      this.assignSrc(info);
    });
  }

  /*
    Assigns the src url of the thumbnail images to the user's drawing
  */
  assignSrc(info){
    var group = info['group'];
    this.storageRef.child(group).child(info['section']+'.png').getDownloadURL().then(function(url) {
      var img: HTMLElement  = document.getElementById(group);
      img.setAttribute("src", url);
    }).catch(function(error) {
      console.log("error", error);
    });
  }

  /*
    if the user has changed, reset the groupManager and redraw thumnails
  */
  ngOnInit(){
    if(this.groupManager.userID != firebase.auth().currentUser.uid) {
      this.groupManager.reset();
      this.groupManager.done.then(() => { //once the new user's groups have been assigned
        this.setThumnails(); // set the thumbnails
      });
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GroupsPage');
  }


}
