// import firebaseConfig from './firebaseConfig';
const firebase = require('firebase/app');
require('firebase/firestore')

const firebaseConfig = require('./firebaseConfig');


firebase.default.initializeApp(firebaseConfig);


// Initialize Cloud Firestore through Firebase
let db = firebase.default.firestore();

// Disable deprecated features
db.settings({
});

module.exports = db;
