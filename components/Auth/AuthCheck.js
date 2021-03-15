import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';

// Components
import AllowRoutes from '../HOC/AllowRoutes';
import Setup from '../Setup/Setup';

// Utility Functions
import { setUser } from '../../redux/actionCreators';
import { localStorageKeys } from '../../util/localStorage';
import userAPI from '../../util/api/user';
import firebase from 'firebase';

export default function AuthCheck({ children }) {
  const user = useSelector(state => state.user);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const dispatch = useDispatch();

  const protectRoutes = () => {
    let isLoggedIn = !!user.username;
    let isProtected = false;

    if (!isLoggedIn && isProtected) {
      console.log('protected route');
      router.push('/');
    }
  }

  const directToAccountSetup = () => {
    // If the user is mid-setup, only allow them to access the /account-setup route
    if (router.pathname !== '/account-setup' && !!user.email && !user.username) {
      console.log('setting up account');
      router.push('/account-setup');
    }
  }

  const checkUserLogin = () => {
    // Check auth state from firebase
    firebase.auth().onAuthStateChanged(async (userAuth) => {
      if (userAuth) { // User is signed in.
        let user = await userAPI.get(userAuth.email);
        dispatch(setUser(user));
      }

      setLoading(false);
    });
  }

  useEffect(checkUserLogin, []);
  useEffect(directToAccountSetup, [router.pathname]);
  useEffect(protectRoutes);

  if (!loading) { // if we're done loading
    return <>
      { children }
    </>
  } else {
    return null
  }
}
