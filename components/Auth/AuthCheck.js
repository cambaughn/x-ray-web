import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import firebase from 'firebase';
import { nanoid } from 'nanoid';
import axios from 'axios';

// Components
import AccountSetup from '../AccountSetup/AccountSetup';
import PaymentPrompt from '../PaymentPrompt/PaymentPrompt';
import Loading from '../Loading/Loading';

// Utility Functions
import { setUser, setSubscriptionStatus, setOnFreeTrial, setIsBetaUser } from '../../redux/actionCreators';
import { localStorageKeys } from '../../util/localStorage';
import { onTrialPeriod } from '../../util/helpers/date';
import userAPI from '../../util/api/user';
import analytics from '../../util/analytics/segment';

export default function AuthCheck({ children }) {
  const user = useSelector(state => state.user);
  const subscriptionStatus = useSelector(state => state.subscriptionStatus);

  const [loading, setLoading] = useState(false);
  const [needAccountSetup, setNeedAccountSetup] = useState(false);
  const [routeIsPublic, setRouteIsPublic] = useState(false);
  const [checkedSubscription, setCheckedSubscription] = useState(false);
  const [checkedUserAuth, setCheckedUserAuth] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();
  const publicRoutes = new Set(['/', '/sign-in', '/confirm-sign-in']);


  // This function runs first
  const checkUserLogin = () => {
    setLoading(true);

    // Check auth state from firebase - if user is logged in, get their info from database
    firebase.auth().onAuthStateChanged(async (userAuth) => {
      if (userAuth) { // User is signed in.
        // Get user details from database
        let userDetails = await userAPI.get(userAuth.email);
        // Load user into Redux
        dispatch(setUser(userDetails));
        // Identify the user for segment
        identifyUserForAnalytics(userDetails);
      } else { // User is not signed in
        analytics.identify({
          userId: nanoid()
        });
      }

      // Let the state know that we've checked for the user login - whether they're logged in or not
      setCheckedUserAuth(true);
    });
  }

  // This function runs once we've checked whether the user is logged in or not.
  // If they are, we check subscription status (whether they're active with Stripe) and beta status (whether to show them beta features or not)
  // If they're not signed in, we only allow them to see the public routes
  const determineUserStatus = async () => {
    if (!!user.email && !subscriptionStatus) { // user is signed in
      // Checking if the user has logged in but not yet set up their name and username
      determineSetupFlowStatus();

      // NOTE: Will need to update this checkSubscriptionStatus function and flow within determineUserStatus when re-enabling subscription
      // For now, just call it so that it marks user as subscribed
      await checkSubscriptionStatus();

      // Whether to show user beta features - no UI implications for the flow here
      // NOTE: not currently using beta features, disabling for now
      // determineBetaStatus();
    }

    setLoading(false);
  }


  // Determine if the user has signed up with their email but not yet put in their name and username
  const determineSetupFlowStatus = () => {
    // If the user is mid-setup, only allow them to access the account setup page
    if (!!user.email && !user.username) {
      router.replace('/');
      setNeedAccountSetup(true);
    } else if (!!user.email && !!user.username) {
      setNeedAccountSetup(false);
    }
  }

  const checkSubscriptionStatus = async () => {
    let status = 'not_subscribed';

    try {
      // if (!!user.username) {
      //   status = 'active';
      //   dispatch(setSubscriptionStatus(status));
      // }

      if (!!user.username) { // if user is signed in
        // get the stripe customer id from the user object
        // We use test_stripe_customer_id for local development with test stripe keys
        let customer_id = window.location.hostname === 'localhost' ? user.test_stripe_customer_id : user.stripe_customer_id;
        customer_id = customer_id || null;

        // NOTE: This code block was used when we implemented our own free trial system. We've sinced switched back to letting Stripe handle that
        // if (user.role === 'admin' || user.role === 'contributor' || !user.trial_end) { // user gets a free pass
        //   status = 'active';
        // } else if (onTrialPeriod(user) ) {
        //   status = 'active';
        //   dispatch(setOnFreeTrial(true));
        // } else

        if (customer_id) { // user is potentially a customer
          const { data } = await axios.post(`${window.location.origin}/api/subscription/status`, { customer_id });
          console.log('stripe customer data ', data);
          status = data.subscriptionStatus;
        }
        dispatch(setSubscriptionStatus(status));
      }

      return Promise.resolve(true);
    } catch (error) { // Not subscribed
      dispatch(setSubscriptionStatus(status));
      return Promise.resolve(false);
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

  // Helper functions
  const identifyUserForAnalytics = (user) => {
    // Identify the user for segment
    analytics.identify({
      userId: user.id,
      traits: {
        email: user.email,
        name: user.name || null,
        username: user.username || null
      }
    });
  }

  const checkRouteProtection = () => {
    // If we've checked for the user sign in
    if (checkedUserAuth) {
      let isPublic = publicRoutes.has(router.pathname);
      // Set route public status regardless of user sign in - but only AFTER we've checked
      setRouteIsPublic(isPublic);

      // If they're not signed in, then re-route them if the route is not public
      if (!user.username && !isPublic) {
        // Re-route to home
        router.replace('/');
      }
    }
  }


  useEffect(checkUserLogin, []); // First thing to check when the app runs
  useEffect(determineUserStatus, [user, checkedUserAuth]); // Once sign in status is checked, verify the other elements of the user status
  useEffect(checkRouteProtection, [router, checkedUserAuth]);
  // useEffect(() => setCheckedSubscription(true), [subscriptionStatus]);

  if (loading) {
    return <Loading />
  } else if (needAccountSetup) { // if they need to sign in, just allow the account setup page
    return <AccountSetup />
  } else if (!!user.username && subscriptionStatus === 'not_subscribed') { // logged in, just needs to subscribe
    return <PaymentPrompt />
  } else if (subscriptionStatus === 'active' || routeIsPublic) { // if user is logged in or route is public
    return <>
      { children }
    </>
  } else { // if we haven't checked everything, just don't load the page
    return null
  }
}
