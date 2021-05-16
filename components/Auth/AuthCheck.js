import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import firebase from 'firebase';
import { nanoid } from 'nanoid';
import axios from 'axios';

// Components
import AccountSetup from '../AccountSetup/AccountSetup';
import PaymentPrompt from '../PaymentPrompt/PaymentPrompt';

// Utility Functions
import { setUser, setSubscriptionStatus, setOnFreeTrial, setIsBetaUser } from '../../redux/actionCreators';
import { localStorageKeys } from '../../util/localStorage';
import { onTrialPeriod } from '../../util/helpers/date';
import userAPI from '../../util/api/user';
import analytics from '../../util/analytics/segment';

export default function AuthCheck({ children }) {
  const user = useSelector(state => state.user);
  const subscriptionStatus = useSelector(state => state.subscriptionStatus);

  const [loading, setLoading] = useState(true);
  const [needAccountSetup, setNeedAccountSetup] = useState(false);
  const [routeIsPublic, setRouteIsPublic] = useState(false);
  const [checkedSubscription, setCheckedSubscription] = useState(false);
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
      } else {
        analytics.identify({
          userId: nanoid()
        });
      }
      setCheckedUserAuth(true);
    });
  }


  const checkSubscriptionStatus = async () => {
    let status = 'not_subscribed';

    try {
      if (!!user.username) { // if user is signed in
        let customer_id = window.location.hostname === 'localhost' ? user.test_stripe_customer_id : user.stripe_customer_id;
        customer_id = customer_id || null;


        if (user.role === 'admin' || user.role === 'contributor' || !user.trial_end) { // user gets a free pass
          status = 'active';
        } else if (onTrialPeriod(user) ) {
          status = 'active';
          dispatch(setOnFreeTrial(true));
        } else if (customer_id) { // user is potentially a customer
          const { data } = await axios.post(`${window.location.origin}/api/subscription/status`, { customer_id });
          status = data.subscriptionStatus;
        }
        dispatch(setSubscriptionStatus(status));
      }
    } catch (error) { // Not subscribed
      dispatch(setSubscriptionStatus(status));
    }
  }

  const determineBetaStatus = () => {
    if (user.role) {
      if (user.role === 'admin' || user.role === 'contributor' || user.role === 'beta') {
        dispatch(setIsBetaUser(true));
        return;
      }
    }

    dispatch(setIsBetaUser(false));
  }

  useEffect(checkUserLogin, []);
  useEffect(checkSubscriptionStatus, [user]); // check only once the user exists
  useEffect(determineBetaStatus, [user]);
  useEffect(determineAccountSetup, [user]);
  useEffect(checkRouteProtection, [router, checkedUserAuth]);
  // useEffect(() => setCheckedSubscription(true), [subscriptionStatus]);

  if (needAccountSetup) { // if they need to sign in, just allow the account setup page
    return <AccountSetup />
  } else if (user.username && subscriptionStatus === 'not_subscribed') { // logged in, just needs to subscribe
    return <PaymentPrompt />
  } else if (subscriptionStatus === 'active' || routeIsPublic) { // if user is logged in or route is public
    return <>
      { children }
    </>
  } else { // if we haven't checked everything, just don't load the page
    return null
  }
}
