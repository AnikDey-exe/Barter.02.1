import * as firebase from 'firebase';

require('@firebase/firestore');

var firebaseConfig = {
    apiKey: "AIzaSyCfnQs7M0pR6FsGdPkJU0fJy_DddAZvzmY",
    authDomain: "barter-a9413.firebaseapp.com",
    databaseURL: "https://barter-a9413-default-rtdb.firebaseio.com",
    projectId: "barter-a9413",
    storageBucket: "barter-a9413.appspot.com",
    messagingSenderId: "154529891529",
    appId: "1:154529891529:web:720ec7d154884a815ff918"
};

// Initialize Firebase
 firebase.initializeApp(firebaseConfig);

export default firebase.firestore();