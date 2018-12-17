# Colloodle
App in ionic that allows you to draw with others and merge your creation

Created by: Hannah Detlaff, Katya Gurgel, Holly Hull, Katia Sievert

Description: Colloodle is a collaborative doodling app where three artists take turns drawing on one of three stacked canvases for the head, body, and legs, while only able to see the bottom edge of the previous drawing. The three canvases are then displayed together on the final screen to create one complete hybrid drawing.

We have three modes: Pass-Around, Random, and Friends. The Pass-Around mode is for a single phone and can be played alone or with the people around you. The Random mode allows users to draw Colloodle doodles with two other random people with the app. The Friends mode allows users to invite two friends to finish their drawing.


## Setup:
Install ionic and other related tools ionic wants you to install (Node.js, Cordova, npm). https://ionicframework.com/docs/intro/installation/

Checkout the code from github.

There are a few different ways to do this. One easy way is to click ‘Clone or download’ and then ‘Download ZIP’. Once the ZIP folder has downloaded, it will be named ‘Colloodle-master’. Unzip it and remember where in your files it is saved.

Email us at colludetodoodle@gmail.com for the firebase config.ts file and add the file to the src folder.
Run `npm audit fix` from inside the cloned directory in your terminal.

## Deploy:

### On Laptop:

Run `ionic serve` from within the cloned directory in your terminal. If it asks you to install ‘@ionic/app-scripts’, say yes.

Ignore and close all errors regarding screenOrientation locking/unlocking, as this is not supported by ionic serve. However, the app should still run smoothly.

Tip: Change orientation to landscape on the drawing page. Keep it vertical on other pages.

### Android:

Follow directions on https://ionicframework.com/docs/intro/deploying/

Install Java JDK, AndroidStudio, and Android Studio’s SDK Manager.

Find the permissions and accept them using your terminal.

Enable developer mode and USB debugging on Android device (how to do this varies by device; you should be able to figure out how to enable these settings on your device via a Google search).

Run `ionic cordova run android` with your Android device connected to your laptop. If you’re computer can’t find your device, you can also try running `ionic cordova run android --device`

### iOS:
Follow directions on https://blog.ionicframework.com/deploying-to-a-device-without-an-apple-developer-account/

Install Xcode.

Run `ionic cordova build ios`

Navigate to platforms/ios and open in Xcode.

Connect device and build to device.

Be sure to recognize developer in Settings.


## Known bugs:
- Notifications and badges sometimes display and sometimes don’t. One phone in the group did not get badges or the completed drawing notifications. (This phone still got invitation notifications).
- The status bar is squished on iOS.
- The app’s UI is not optimized for tablets. However, it still can be used on a tablet.
- If someone closes the app while they were working on a random drawing, that drawing will be stuck waiting for them until they go back into the app and either finish the drawing or navigate back to the home page. Possible fix: implement some kind of timer that automatically moves the drawing back into the next() list and the user back to the homepage after x time? As it is now, that drawing can never be completed if that user does not go back on the app.


## Next steps:
- Fix all current bugs.
- Implement save and share for completed drawings. Saving the image was more difficult than expected.
- Have drawing groups work for 2 or 4 people, not just 3.
- Add a color picker and eyedropper tool.
- Add a paint bucket/fill tool.
- Have the chosen color checked or pressed on the brush menu.
- Add an eraser icon of our own.
- Show the full drawings on the Completed section of the gallery page, not just the one segment.
- Add badges for being added to a drawing.
- Display which user did which part of the drawing. (Maybe, and only for Friends Mode drawings).
- Allow users to delete their account.
- Allow users to switch which email address is linked to their account.
