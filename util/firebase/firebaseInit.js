// import firebaseConfig from './firebaseConfig';
const firebase = require('firebase/app');
require('firebase/firestore')

const firebaseConfig = require('./firebaseConfig');


// Config required for production
// require('dotenv').config();

// let config = {
//   apiKey: firebaseConfig.REACT_APP_API_KEY,
//   authDomain: firebaseConfig.REACT_APP_AUTH_DOMAIN,
//   databaseURL: firebaseConfig.REACT_APP_DATABASE_URL,
//   projectId: firebaseConfig.REACT_APP_PROJECT_ID,
//   storageBucket: firebaseConfig.REACT_APP_STORAGE_BUCKET,
//   messagingSenderId: firebaseConfig.REACT_APP_MESSAGING_SENDER_ID
// }

firebase.default.initializeApp(firebaseConfig);


// Initialize Cloud Firestore through Firebase
let db = firebase.default.firestore();

// Disable deprecated features
db.settings({
});

module.exports = db;
