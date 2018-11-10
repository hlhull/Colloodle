import { Injectable } from '@angular/core';
import { NetworkStorageProvider } from '../image-storage/network-storage';
import firebase from 'firebase';

/*
  Generated class for the GroupManagerProvider provider.
*/
@Injectable()
export class GroupManagerProvider {
  storageRef = firebase.storage().ref();
  databaseRef = firebase.database().ref();
  userID = firebase.auth().currentUser.uid;
  userRef = this.databaseRef.child("users").child(this.userID);
  completed = [];
  inProgress = [];
  done : any;
  lastTime: any;

  constructor() {
    this.done = this.getGroups();
    this.done.then(() => this.listenForAddedGroups());
  }

  /*
    sets variable groups to array of all groups user is in
  */
  getGroups(){
    var self = this;
    var promises = [];

    // add all groups user is currently in to inProgress or completed in form
    // [{"section": x, "group": y}, {...}, ...]
    var userInfo = this.userRef.orderByKey().once('value');
    return userInfo.then((snapshot) => {
      snapshot.forEach(function(userGroupSnapshot) {
        self.lastTime= userGroupSnapshot.key;
        var promise = self.addGroup(userGroupSnapshot.key, userGroupSnapshot.val());
        promises.push(promise);
      });
      return Promise.all(promises);
    });
  }

  /*
    When a user joins a new group, adds it to inProgress or Completed
  */
  listenForAddedGroups(){
    // increment the last timestamp so we can start listening at the next possible timestamp
    length = this.lastTime.length;
    var char = String.fromCharCode(this.lastTime[length-1].charCodeAt(0) + 1);
    this.lastTime = this.lastTime.substring(0,length-1) + char;

    var self = this;
    this.userRef.orderByKey().startAt(self.lastTime).on('child_added', userGroupSnapshot => {
        self.addGroup(userGroupSnapshot.key, userGroupSnapshot.val());
    });
  }

  /*
    Takes a group a user is in and adds it to either inProgress or Completed
  */
  addGroup(group, section){
    var self = this;
    var promise = self.databaseRef.child("groups").child(group).once('value', function(groupSnapshot){
        var info = {"section" : section, "group": groupSnapshot.key};
        if(groupSnapshot.val() == "drawing"){
          self.inProgress.push(info);
        } else {
          self.completed.push(info);
        }
      });
    return promise;
  }

  /*
    once everyone has seen the drawing, remove it from Firebase storage and database
  */
  deleteGroup(groupNum){
    for (var i = 0; i < 3; i++) {
      this.storageRef.child(groupNum).child(i + ".png").delete();
    }
    this.databaseRef.child("groups").child(groupNum).remove();
  }
}
