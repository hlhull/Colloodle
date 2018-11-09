import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { GroupManagerProvider } from '../../providers/group-manager/group-manager';
import { FinalPage } from '../final/final';
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
  canvases = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private groupManager: GroupManagerProvider) {
    this.groupManager.getGroups().then(() => {
      console.log("in groups constructor");
      this.setCanvases();
    });
  }

  setCanvases(){
    console.log('setting');
    var array = this.groupManager.inProgress;
    console.log(array.length);
    console.log(this.groupManager.inProgress);
    // for (var info of array){
    //   console.log(info);
    //   console.log("klas;jdf");
    // }
    var self= this;
    //this.groupManager.inProgress.forEach(function(value) {
    //  console.log(value["section"], value["group"])
      this.getImageSrc();//(value["section"], value["group"]);
    //});
  }

  seeGroup(groupName){
    console.log("got it");
    var imgStorage = this.groupManager.getGroupImages(groupName);
    this.navCtrl.push(FinalPage, {imageStorage: imgStorage}, {animate:false});
  }

  getSectionName(group, num){
    //this.getImageSrc(group, num);
    switch(num){
      case 0:
        return "Head";
      case 1:
        return "Torso";
      case 2:
        return "Legs";
    }

  }

  ngAfterViewInit(){

  }

  setCanvasID(group){
    //console.log("settingID", group);
    this.canvases.push(group);
    return group;
  }

  getImageSrc(){
    console.log("herio");
    var canvas: any;
    this.canvases.forEach((id) => {
      console.log(id);
      canvas = document.getElementById(id);
      console.log("canvas:" , canvas);
      var ctx = canvas.getContext("2d");
      let img = new Image();
      this.storageRef.child(id).child(0 + '.png').getDownloadURL().then((imgUrl) => function() {
        console.log(imgUrl);
        img.src = imgUrl;
        img.onload = function() { //once the image loads, then draw it on the canvas
          ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);
      }
    }); });


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GroupsPage');
  }

}
