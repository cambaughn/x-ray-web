import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styles from './PaymentPrompt.module.scss';
import StripeCheckout from 'react-stripe-checkout';
import { loadStripe } from '@stripe/stripe-js';
import { createCheckoutSession } from 'next-stripe/client';
import axios from 'axios';
import classNames from 'classnames';
import { Loader } from 'react-feather';

// Components

// Utility functions
import userAPI from '../../util/api/user';
import { setUser } from '../../redux/actionCreators';


const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

// console.log('environment variables: ', process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY, process.env.NEXT_PUBLIC_STANDARD_SUBSCRIPTION);

export default function PaymentPrompt({}) {
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();

  const createCustomer = async () => {
    try {
      let customer_id = window.location.hostname === 'localhost' ? user.test_stripe_customer_id : user.stripe_customer_id;
      customer_id = customer_id || null;

      if (!customer_id) { // make sure user doesn't already have stripe customer id - otherwise will be duplicating customers in stripe
        const { data } = await axios.post(`${window.location.origin}/api/create_customer`, { email: user.email, name: user.name });
        let { customer } = data;

        // Update the user in our database to help
        let updates = {};
        if (window.location.hostname === 'localhost') { // local, for testing/development
          updates.test_stripe_customer_id = customer.id;
        } else { // production
          updates.stripe_customer_id = customer.id;
        }

        await userAPI.update(user.id, updates);
        let updatedUser = await userAPI.get(user.id);
        await dispatch(setUser(updatedUser));

        return Promise.resolve(customer.id);
      } else {
        return Promise.resolve(customer_id);
      }
    } catch (error) { // Not subscribed
      return Promise.resolve(null);
    }
  }

  const handleClick = async () => {
    if (!loading) {
      try {
        setLoading(true);
        let customerId = await createCustomer();
        if (customerId) {
          const session = await createCheckoutSession({
            customer: customerId || null,
            success_url: `${window.location.origin}/subscribe/success`,
            cancel_url: window.location.href,
            line_items: [{ price: process.env.NEXT_PUBLIC_STANDARD_SUBSCRIPTION, quantity: 1 }],
            payment_method_types: ['card'],
            mode: 'subscription',
            trial_period_days: 3
          })

          const stripe = await stripePromise;
          const result = stripe.redirectToCheckout({ sessionId: session.id });

          if (result.error) { // if there is an error with the result, show error
            setShowError(true);
            setLoading(false);
          }

        } else { // if there is no customerId, show error
          setLoading(false);
          setShowError(true);
        }
      } catch(error) {
        console.error(error);
        setLoading(false);
        setShowError(true);
      }
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
          {/* <h3 className={styles.headline}>Your trial has expired</h3> */}
          {/* <h2 className={styles.subhead}>Subscribe to continue enjoying X-ray</h2> */}
          <h2 className={styles.headline}>Almost there!</h2>
          <h2 className={classNames(styles.headline, styles.subhead)}>Your <span className={styles.bold}>X-ray Standard</span> subscription unlocks a world of data and resources.</h2>

          <button role="link" className={styles.button} onClick={handleClick}>
            { !loading
              ? <span className={styles.buttonText}>Subscribe</span>
              : <Loader className={classNames(styles.loader)} size={20} />
            }
          </button>

          <h3 className={styles.label}><span className={styles.bold}>X-ray Standard</span> includes:</h3>
          <ul className={styles.featuresList}>
            <li className={styles.feature}>20k+ English & Japanese Pokémon cards</li>
            <li className={styles.feature}>100k+ sales data points</li>
            <li className={styles.feature}>Detailed charts and graphs</li>
            <li className={styles.feature}>Sales breakdowns for each card</li>
            <li className={styles.feature}>PSA population reports</li>
            <li className={classNames(styles.feature, styles.highlightedFeature)}>More products and data coming soon!</li>
          </ul>
      </div>

      { showError &&
        <div className={styles.errorMessage}>
          <p>Uh oh! Looks like there was an error. Click the button to try again.</p>
          <p>If the issue persists, please email support@x-ray.fun</p>
        </div>
      }
    </div>
  )
}
