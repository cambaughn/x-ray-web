import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import firebase from 'firebase';
import { nanoid } from 'nanoid';
import axios from 'axios';

// Components
import AccountSetup from '../AccountSetup/AccountSetup';

// Utility Functions
import { setUser } from '../../redux/actionCreators';
import { localStorageKeys } from '../../util/localStorage';
import userAPI from '../../util/api/user';
import analytics from '../../util/analytics/segment';

export default function AuthCheck({ children }) {
  const user = useSelector(state => state.user);

  const [loading, setLoading] = useState(true);
  const [needAccountSetup, setNeedAccountSetup] = useState(false);
  const [routeIsPublic, setRouteIsPublic] = useState(false);
  const [checkedUserAuth, setCheckedUserAuth] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();
  const publicRoutes = new Set(['/', '/sign-in', '/confirm-sign-in']);


  const checkRouteProtection = () => {
    setRouteIsPublic(publicRoutes.has(router.pathname));

    if (checkedUserAuth && !user.username && !publicRoutes.has(router.pathname)) {
      router.replace('/');
    }
  }

  const determineAccountSetup = () => {
    // If the user is mid-setup, only allow them to access the account setup page
    if (!!user.email && !user.username) {
      router.replace('/');
      setNeedAccountSetup(true);
    } else if (!!user.email && !!user.username) {
      setNeedAccountSetup(false);
    }
  }

  const checkUserLogin = () => {
    // Check auth state from firebase
    firebase.auth().onAuthStateChanged(async (userAuth) => {
      if (userAuth) { // User is signed in.
        let userDetails = await userAPI.get(userAuth.email);
        dispatch(setUser(userDetails));

        // Identify the user for segment
        analytics.identify({
          userId: userDetails.id,
          traits: {
            email: userDetails.email,
            name: userDetails.name || null,
            username: userDetails.username || null
          }
        });

        console.log('identified user with traits');
      } else {
        analytics.identify({
          userId: nanoid()
        });
      }
      setCheckedUserAuth(true);
    });
  }


  const checkSubscriptionStatus = async () => {
    try {

      // TODO: replace with actual user email
      const { data } = await axios.post(`${window.location.origin}/api/subscription`, { email: 'cam.baughn@gmail.com' });

      console.log('response ==>', data);
    } catch (error) { // Not subscribed

    }
  }

  useEffect(checkUserLogin, []);
  useEffect(checkSubscriptionStatus, []);
  useEffect(determineAccountSetup, [user]);
  useEffect(checkRouteProtection, [router, checkedUserAuth]);

  if (needAccountSetup) { // if they need to sign in, just allow the account setup page
    return <AccountSetup />
  } else if (!!user.username || routeIsPublic) { // if user is logged in and route is public
    return <>
      { children }
    </>
  } else { // if we haven't checked everything, just don't load the page
    return null
  }
}
