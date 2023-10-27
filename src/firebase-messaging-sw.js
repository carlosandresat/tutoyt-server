import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object

const firebaseConfig = {
    apiKey: "AIzaSyBRbb9qP5bAoIVP-xqcNvcLqzHmBOyRdHY",
    authDomain: "tutoyt-ce67d.firebaseapp.com",
    projectId: "tutoyt-ce67d",
    storageBucket: "tutoyt-ce67d.appspot.com",
    messagingSenderId: "867918806288",
    appId: "1:867918806288:web:4c8547a58d3228f1c27995",
    measurementId: "G-WDT7W8P00M"
  };
  

// Initialize Firebase
//const app = initializeApp(firebaseConfig);

// Initialize Firebase Cloud Messaging and get a reference to the service
//const messaging = getMessaging(app);
/*
getToken(messaging, {vapidKey: "BHmXVqy0nglFwUnHdzQZF_OcFGjefmTbyLe15rGCIGaL3FJGYnivf3n8AaIp3VdBi9byttGaWR8sV4t8vtw0Apk"}).then((currentToken) => {
    if(currentToken) {
        console.log('currentToken: ', currentToken);
    } else {
        console.log('Cannot get token')
    }
});
*/