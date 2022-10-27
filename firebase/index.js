var serviceAccount = require('./privateKey.json');
var fcm = require('fcm-notification');
var FCM = new fcm(serviceAccount);
var firebaseconf = require("firebase-admin");
firebaseconf.initializeApp({
    credential: firebaseconf.credential.cert(serviceAccount),
    name: 'NotificationHub',
    storageBucket: ""
});
module.exports = {
    firebaseconf: firebaseconf,
    FCM: FCM
}