import { Injectable } from '@angular/core';
//import { RandomStorageProvider } from '../image-storage/random-storage';
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
  invited = [];
  done: any;
  compLastTime: any;
  invitLastTime: any;
  new = 0;
  connected = false;

  constructor(private localNotifications: LocalNotifications) {}

  /*
    sets up manager for a new user, getting their groups and listening for changes
  */
  setUpManager(){
    if(firebase.auth().currentUser != null){
        this.listenForConnectionChanges();
        this.userID = firebase.auth().currentUser.uid;
        this.userRef = this.databaseRef.child("users").child(this.userID);
        this.listenForAddedGroups();
        this.listenForCompletedGroups();
        this.listenForInvitedRemoved();
    }
  }

  /*
    When a user joins a new group, adds it to inProgress or Completed or Invited
  */
  listenForAddedGroups(){
    var self = this;

    this.userRef.child("completed").orderByKey().on('child_added', userGroupSnapshot => {
        self.addGroup(userGroupSnapshot.key, userGroupSnapshot.val());
    });

    this.userRef.child("invited").orderByKey().on('child_added', userGroupSnapshot => {
      var info = {"section" : null, "group": userGroupSnapshot.key, "conflict": false, "inviter" : userGroupSnapshot.val()};
      self.invited.push(info);
      self.sendNotification(false);
    });
  }

  /*
    when a group in the user's invited list in FB is removed, remove it from
    invited[] in the groupManager
  */
  listenForInvitedRemoved(){
    var found = false;
    var self = this;

    this.userRef.child("invited").on('child_removed', removedSnapshot => {
      found = false;
      var length = self.invited.length;
      for (var i = 0; i < length; i++) {
          var entry = self.invited[i];
          if(!found && entry['group'] == removedSnapshot.key){
            found = true;
            self.invited.splice(i, 1);
          }
      }
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
      var val = changedSnapshot.val();
      if(val == 0){
        self.checkForCompleted(changedSnapshot.key);
      } else if (val == "currDrawing" || val == 12){
        self.checkForInvitedConflict(val, changedSnapshot.key);
      }
    });
  }

  listenForConnectionChanges(){
    var self = this;
    var connectedRef = firebase.database().ref(".info/connected");
    connectedRef.on("value", function(snap) {
      if (snap.val()) {
        self.connected = true;
      } else {
        self.connected = false;
      }
    });
  }

  checkForCompleted(groupNum){
    var length = this.inProgress.length;
    for (var i = 0; i < length; i++) {
        var entry = this.inProgress[i];
        if(entry['group'] == groupNum && !found){
          var found = true;
          this.inProgress.splice(i, 1);
          this.completed.push(entry);
          this.new += 1;
          this.sendNotification(true);
        }
    }
  }

  checkForInvitedConflict(status, groupNum){
    var length = this.invited.length;
    for (var i = 0; i < length; i++) {
        var entry = this.invited[i];
        if(entry['group'] == groupNum && !found){
          var found = true;
          if(status == "currDrawing"){
            this.invited[i]['conflict'] = true;
          } else {
            this.invited[i]['conflict'] = false;
          }
        }
    }
  }

  sendNotification(type){
    var title, text;
    if(type){
      title = 'A drawing is complete!';
      text = 'Go to the drawings page to see the finished creation';
    } else {
      title = "You've been invited to a drawing!";
      text = 'Go to the Friends drawing mode to doodle';
    }
    this.localNotifications.schedule({
        title: title,
        text: text,
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
        var value = groupSnapshot.val()
        if(value == "inProgress" || value == 11 || value == 12){
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
      this.deleteFromUserFB(group);
    }
  }

  /*
    remove group from user's list on FB; also increment # of users who have
    deleted the drawing in total
  */
  deleteFromUserFB(groupNum){
    var self = this;
    this.userRef.child("completed").child(groupNum).remove();
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
    this.invited = [];
    this.new = 0;

    if(this.userID != null){
      this.databaseRef.child("groups").off();
      //this.userRef.child("completed").off();
    }

    this.userID = null;
    this.userRef = null;
  }

  resetNew(){
    this.new = 0;
  }
}
