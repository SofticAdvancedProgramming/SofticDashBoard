importScripts("https://www.gstatic.com/firebasejs/8.0.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.0.0/firebase-messaging.js");


firebase.initializeApp({
  apiKey: "AIzaSyCCZ-fcHWUvAtLaJLZG4V69s36QDib4MCk",
  authDomain: "notifyfcm-897f3.firebaseapp.com",
  projectId: "notifyfcm-897f3",
  storageBucket: "notifyfcm-897f3.appspot.com",
  messagingSenderId: "875406829786",
  appId: "1:875406829786:web:4125c070d5d2448115dde3"
});


// Retrieve firebase messaging
const messaging = firebase.messaging();

