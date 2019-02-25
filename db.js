import firebase from 'firebase';
import 'firebase/firestore'
const config = {
  apiKey: "AIzaSyCc-ngBjU75LzqbhUSneeetuUoRiXW4GMg",
  authDomain: "khalid-project-221812.firebaseapp.com",
  databaseURL: "https://khalid-project-221812.firebaseio.com",
  projectId: "khalid-project-221812",
  storageBucket: "khalid-project-221812.appspot.com",
  messagingSenderId: "770859089899"
};
// const config = {
//   apiKey: "AIzaSyC7kIJ7T1sLRWYT8yhirrLOuEw-5MSEVg4",
//   authDomain: "cp3700-f5264.firebaseapp.com",
//   databaseURL: "https://cp3700-f5264.firebaseio.com",
//   projectId: "cp3700-f5264",
//   storageBucket: "cp3700-f5264.appspot.com",
//   messagingSenderId: "143283342395"
//   };
firebase.initializeApp(config);
const db = firebase.firestore();

// Disable deprecated features
db.settings({
  timestampsInSnapshots: true
});
export default db