import { Injectable } from '@angular/core';
import { NetworkStorageProvider } from '../image-storage/network-storage';
import { LocalNotifications } from '@ionic-native/local-notifications';
import firebase from 'firebase';

/*
  Generated class for the GroupManagerProvider provider.
*/
@Injectable()
export class GroupManagerProvider {
  storageRef = firebase.storage().ref();
  databaseRef = firebase.database().ref();
  userID: string = null;
  userRef: firebase.database.Reference;
  completed = [];
  inProgress = [];
  done : any;
  lastTime: any;

  constructor(private localNotifications: LocalNotifications) {}

  /*
    sets up manager for a new user, getting their groups and listening for changes
  */
  setUpManager(){
    if(firebase.auth().currentUser != null){
        this.userID = firebase.auth().currentUser.uid;
        this.userRef = this.databaseRef.child("users").child(this.userID);
        this.done = this.getGroups();
        this.done.then(() => {
          this.listenForAddedGroups();
          this.listenForCompletedGroups();
        });
    }
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
    if(this.lastTime == undefined){
      this.lastTime = 'a';
    } else {
      length = this.lastTime.length;
      var char = String.fromCharCode(this.lastTime[length-1].charCodeAt(0) + 1);
      this.lastTime = this.lastTime.substring(0,length-1) + char;
    }

    var self = this;
    //var user = this.userID;
    this.userRef.orderByKey().startAt(self.lastTime).on('child_added', userGroupSnapshot => {
        self.addGroup(userGroupSnapshot.key, userGroupSnapshot.val());
    });
  }

  /*
    Once an inProgress group finishes, move to completed list and remove from inProgress
  */
  listenForCompletedGroups(){
    var self = this;
    var found = false;

    //fires every time a group in "groups" changes
    this.databaseRef.child("groups").on('child_changed', changedSnapshot => {
      // loop over inProgress and if the changed group matches, move to completed
      found = false;
      if(changedSnapshot.val() == 0){
        var length = this.inProgress.length;
        for (var i = 0; i < length; i++) {
            var entry = self.inProgress[i];
            if(entry['group'] == changedSnapshot.key && !found){
              var found = true;
              self.inProgress.splice(i, 1);
              self.completed.push(entry);
              self.sendNotification();
            }
        }
      }
    });
  }

  sendNotification(){
    this.localNotifications.schedule({
        title: 'A drawing is complete!',
        text: 'Go to the drawings page to see the finished creation',
        sound: null
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
    Remove group from user's list of groups and from completed list
  */
  deleteGroup(group){
    var indexToDelete = null;
    var length = this.completed.length;
    for (var i = 0; i < length; i++) {
        if(this.completed[i]['group'] == group){
          indexToDelete = i;
        }
    }
    if(indexToDelete != null){
      this.completed.splice(indexToDelete, 1);
    }

    this.deleteFromUserFB(group);
  }

  /*
    remove group from user's list on FB; also increment # of users who have
    deleted the drawing in total
  */
  deleteFromUserFB(groupNum){
    var self = this;
    this.userRef.child(groupNum).remove();
    this.databaseRef.child("groups").child(groupNum).once('value', function(snapshot) {
      if(snapshot.val() >= 2){
        self.deleteGroupFromStorage(groupNum);
      } else {
        self.databaseRef.child("groups").child(groupNum).set(snapshot.val() + 1);
      }
    });
  }

  /*
    once everyone has seen the drawing, remove it from Firebase storage and database
  */
  deleteGroupFromStorage(groupNum){
    for (var i = 0; i < 3; i++) {
      this.storageRef.child(groupNum).child(i + ".png").delete();
    }
    this.databaseRef.child("groups").child(groupNum).remove();
  }

  /*
    reset the provider by emptying the lists and turning off listeners
  */
  reset(){
    this.completed = [];
    this.inProgress = [];

    if(this.userID != null){
      this.databaseRef.child("groups").off();
      this.userRef.orderByKey().startAt(this.lastTime).off();
    }

    this.userID = null;
    this.userRef = null;
  }
}
