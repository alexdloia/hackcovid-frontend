import firebase from 'firebase/app';
import 'firebase/firestore';

const firebaseConfig = {
 	apiKey: "AIzaSyCklA2dpaIykJ2ZpkwvhJITlc5sVhIqOcg",
 	authDomain: "hackcovid-project.firebaseapp.com",
 	databaseURL: "https://hackcovid-project.firebaseio.com",
 	projectId: "hackcovid-project",
  	storageBucket: "hackcovid-project.appspot.com",
  	messagingSenderId: "251585414236",
  	appId: "1:251585414236:web:6282cbdf832b2fa9181299",
  	measurementId: "G-WPF1G3WTG9"
};
firebase.initializeApp(firebaseConfig);
export default firebase;
