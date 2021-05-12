import firebase from 'firebase';
import db from './firebaseInit.js';
import { isBrowser } from '../client';
import { localStorageKeys } from '../localStorage';

let actionCodeSettings = {
  // URL you want to redirect back to. The domain (www.example.com) for this
  // URL must be in the authorized domains list in the Firebase Console.
  url: isBrowser() ? `${window.location.origin}/confirm-sign-in` : 'http://localhost:3000/confirm-sign-in',
  // This must be true.
  handleCodeInApp: true
};

const sendEmailLink = async (email) => {
  try {
    await firebase.auth().sendSignInLinkToEmail(email, actionCodeSettings);
    if (isBrowser()) {
      window.localStorage.setItem(localStorageKeys.email, email);
    }
    return Promise.resolve(true);
  } catch (error) {
    console.error(error);
    return Promise.resolve(false);
  }
}

const userSignedInWithLink = () => {
  if (isBrowser()) {
    return firebase.auth().isSignInWithEmailLink(window.location.href);
  }
  return false;
}

const signInUser = async (email) => {
  try {
    let result = await firebase.auth().signInWithEmailLink(email, window.location.href);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export { sendEmailLink, userSignedInWithLink, signInUser }
