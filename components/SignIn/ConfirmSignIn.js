import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
// Share styles with sign in page
import styles from './SignIn.module.scss';

// Components

// Utility functions
import { userSignedInWithLink, signInUser } from '../../util/firebase/firebaseAuth';
import { localStorageKeys } from '../../util/localStorage';

export default function ConfirmSignIn({}) {

  const checkForSignIn = async () => {
    try {
      if (userSignedInWithLink()) {
        let userEmail = window.localStorage.getItem(localStorageKeys.email);
        if (!userEmail) {
          userEmail = window.prompt('Please provide your email for confirmation');
        }

        let user = await signInUser(userEmail);
        console.log('user ====>', user);
        if (user) {

        } else {
          // Present error message - set to sign in page
        }
      }
    } catch(error) {
      console.error(error);
    }
  }

  useEffect(checkForSignIn, []);

  return (
    <div className={styles.container}>

    </div>
  )
}
