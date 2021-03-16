import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';

// Components
// import AccountSetup from '../AccountSetup/AccountSetup';

// Utility Functions
import { setUser } from '../../redux/actionCreators';
import { localStorageKeys } from '../../util/localStorage';
import userAPI from '../../util/api/user';
import firebase from 'firebase';

export default function AuthCheck({ children }) {
  const user = useSelector(state => state.user);

  const [loading, setLoading] = useState(true);
  const [accountSetup, setAccountSetup] = useState(false);
  const [routeIsPublic, setRouteIsPublic] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();
  const publicRoutes = new Set(['/', '/sign-in', '/confirm-sign-in']);


  const checkRouteProtection = () => {
    setRouteIsPublic(publicRoutes.has(router.pathname));

    if (!user.username && !publicRoutes.has(router.pathname)) {
      console.log('protected route');
      router.replace('/');
    }
  }

  const determineAccountSetup = () => {
    // If the user is mid-setup, only allow them to access the /account-setup route
    if (router.pathname !== '/account-setup' && !!user.email && !user.username) {
      console.log('setting up account');
      // router.push('/account-setup');
    }
  }

  const checkUserLogin = () => {
    // Check auth state from firebase
    firebase.auth().onAuthStateChanged(async (userAuth) => {
      if (userAuth) { // User is signed in.
        let user = await userAPI.get(userAuth.email);
        dispatch(setUser(user));
      }
    });
  }

  useEffect(checkUserLogin, []);
  // useEffect(determineAccountSetup, [user.username]);
  // Call if either the route changes
  useEffect(checkRouteProtection);

  if (!!user.username || routeIsPublic) { // if user is logged in and route is public
    return <>
      { children }
    </>
  } else {
    return null
  }
}
