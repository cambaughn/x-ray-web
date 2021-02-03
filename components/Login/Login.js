import React, { useState, useEffect } from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from 'firebase';
import styles from './Login.module.scss';

// import * as firebaseui from 'firebaseui'
// import 'firebaseui/dist/firebaseui.css'

// Components

// Utility functions
import { loginUser } from '../../util/api/user';


export default function Login({ setUser }) {
  let unregisterAuthObserver;
  const registerAuthListener = () => {
    return firebase.auth().onAuthStateChanged(async (authUser) => {
      try {
        // This function is what we get back when the sign in happens
        let configuredUser = {
          full_name: authUser.displayName,
          email: authUser.email,
          profile_photo: authUser.photoURL
        }

        let user = await loginUser(configuredUser);
        console.log('got user! ', user);
        setUser(user || {});
      } catch(error) {
        console.error(error);
      }
    });
  }

  useEffect(registerAuthListener, []);
  // Configure FirebaseUI.
  const uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: 'popup',
    callbacks: {
      // Avoid redirects after sign-in.
      signInSuccessWithAuthResult: () => false
    },
    // We will display Google and Facebook as auth providers.
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID
    ]
  };

  return (
    <div className={styles.container}>
      <p>Please sign-in:</p>
      <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()}/>
    </div>
  )
}
