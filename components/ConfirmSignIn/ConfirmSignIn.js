import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
// Share styles with sign in page
import styles from '../SignIn/SignIn.module.scss';

// Components

// Utility functions
import { userSignedInWithLink, signInUser } from '../../util/firebase/firebaseAuth';
import { localStorageKeys } from '../../util/localStorage';
import userAPI from '../../util/api/user';

export default function ConfirmSignIn({ user, setUser }) {
  const [confirmed, setConfirmed] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const router = useRouter();

  const checkForSignIn = async () => {
    try {
      if (user.id) { // if the user is already logged in and loaded into redux
        router.push('/');
      } else if (userSignedInWithLink()) {
        // First, check if we have the user's email in local storage
        let userEmail = window.localStorage.getItem(localStorageKeys.email);

        // If we don't have it (different device, usually), ask to confirm
        if (!userEmail) {
          userEmail = window.prompt('Please provide your email for confirmation');
        }

        userEmail = userEmail.trim(); // just to make sure there's no extra white space
        window.localStorage.setItem(localStorageKeys.email, userEmail);


        // Try to sign in with the email we have available
        let result = await signInUser(userEmail);
        if (result) { // if the user is signed in
          // Check if they already exist. If they do, just add them to redux.
          // Otherwise, create entry in the database for them
          let newUser = await userAPI.create(userEmail);
          if (newUser) {
            console.log('new user here ! ', newUser);
            setUser(newUser);
          } else {
            setLoginError(true);
          }
        } else { // was not able to log in
          // Present error message - send back to sign in page
          setLoginError(true);
        }
      } else { // did not visit this page from email link
        setLoginError(true);
      }
    } catch(error) {
      console.error(error);
      setLoginError(true);
    }
  }

  useEffect(checkForSignIn, []);

  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
        { confirmed &&
          <span className={styles.smallText}>Your email is confirmed.</span>
        }
        <h2 className={styles.headline}>{!loginError ? 'Welcome to X-ray!' : 'Oops, looks like something went wrong!'}</h2>
        { !loginError
          ? <h2 className={classNames(styles.headline, styles.subhead)}>First things first. Let's get you a username.</h2>
          : <Link href={'/sign-in'}><h2 className={classNames(styles.headline, styles.subhead, styles.link)}>Click here to go back to sign in.</h2></Link>
        }
      </div>
    </div>
  )
}
