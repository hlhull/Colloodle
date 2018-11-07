import { Injectable } from '@angular/core';
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
  //groups: any;
  completed: any;

  constructor() {
    this.getGroups();

  }

  /*
    sets variable groups to array of all groups user is in
  */
  getGroups(){
    var self = this;

    // add all groups user is currently in to groups[]; listen for change
    this.userRef.once('value', function(snapshot){
      snapshot.forEach(function(childSnapshot) {
        //self.groups.push(childSnapshot.key);
        self.databaseRef.child("groups").child(childSnapshot.key).once('child_changed', function(snapshot){
          self.completed.push(childSnapshot.key);
        })
      });
    });

    // when the user is added to a group, add it to groups[]
    this.userRef.limitToLast(1).on('child_added', function (childSnapshot) {
      self.databaseRef.child("groups").child(childSnapshot.key).once('child_changed', function(snapshot){
        self.completed.push(childSnapshot.key);
      })
    });
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
