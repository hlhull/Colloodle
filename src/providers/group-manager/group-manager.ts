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

  constructor() {
    this.done = this.getGroups();
  }

  /*
    sets variable groups to array of all groups user is in
  */
  getGroups(){
    var self = this;
    var promises = [];

    // add all groups user is currently in to inProgress or completed in form
    // [{"section": x, "group": y}, {...}, ...]
    var userInfo = this.userRef.once('value');
    return userInfo.then((snapshot) => {
      snapshot.forEach(function(userGroupSnapshot) {
        var promise = self.databaseRef.child("groups").child(userGroupSnapshot.key).once('value', function(groupSnapshot){
            var info = {"section" : userGroupSnapshot.val(), "group": groupSnapshot.key};
            if(groupSnapshot.val() == "drawing"){
              console.log("inProgress");
              self.inProgress.push(info);
            } else {
              console.log("completed");
              self.completed.push(info);
            }
        });
        promises.push(promise);
      });
      return Promise.all(promises);
    });

    // when the user is added to a group, add it to groups[]
    // this.userRef.limitToLast(1).on('child_added', function (childSnapshot) {
    //   self.databaseRef.child("groups").child(childSnapshot.key).once('child_changed', function(snapshot){
    //     self.completed.push(childSnapshot.key);
    //   })
    // });
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
