import firebase from 'firebase';
import db from './firebaseInit';
import { isBrowser } from '../client';

let actionCodeSettings = {
  // URL you want to redirect back to. The domain (www.example.com) for this
  // URL must be in the authorized domains list in the Firebase Console.
  url: isBrowser() ? `${window.location.href}` : 'http://localhost:3000/sign-in',
  // This must be true.
  handleCodeInApp: true
};

const sendEmailLink = async (email) => {
  try {
    await firebase.auth().sendSignInLinkToEmail(email, actionCodeSettings);
    if (isBrowser()) {
      await window.localStorage.setItem('xrayEmail', email);
    }
    return Promise.resolve(true);
  } catch (error) {
    console.error(error);
    return Promise.resolve(false);
  }
}

export { sendEmailLink }
