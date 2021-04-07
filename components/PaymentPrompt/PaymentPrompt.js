import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styles from './PaymentPrompt.module.scss';
import StripeCheckout from 'react-stripe-checkout';
import { loadStripe } from '@stripe/stripe-js';
import { createCheckoutSession } from 'next-stripe/client';
import axios from 'axios';
import classNames from 'classnames';

// Components

// Utility functions
import userAPI from '../../util/api/user';
import { setUser } from '../../redux/actionCreators';


const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

export default function PaymentPrompt({}) {
  const [showError, setShowError] = useState(false);
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();

  const createCustomer = async () => {
    try {
      if (!user.stripe_customer_id) { // make sure user doesn't already have stripe customer id - otherwise will be duplicating customers in stripe
        const { data } = await axios.post(`${window.location.origin}/api/create_customer`, { email: user.email, name: user.name });
        let { customer } = data;

        // Update the user in our database to help
        await userAPI.update(user.id, { stripe_customer_id: customer.id });
        let updatedUser = await userAPI.get(user.id);
        await dispatch(setUser(updatedUser));

        return Promise.resolve(customer.id);
      } else {
        return Promise.resolve(user.stripe_customer_id);
      }
    } catch (error) { // Not subscribed
      return Promise.resolve(null);
    }
  }

  const handleClick = async () => {
    try {
      let customerId = await createCustomer();
      if (customerId) {
        const session = await createCheckoutSession({
          customer: customerId || null,
          success_url: `${window.location.href}`,
          cancel_url: window.location.href,
          line_items: [{ price: "price_1IBGHuIp4rvRKVTPIgaKmH56", quantity: 1 }],
          payment_method_types: ['card'],
          mode: 'subscription'
        })

        const stripe = await stripePromise;
        const result = stripe.redirectToCheckout({ sessionId: session.id });

        if (result.error) { // if there is an error with the result, show error
          setShowError(true);
        }

      } else { // if there is no customerId, show error
        setShowError(true);
      }
    } catch(error) {
      setShowError(true);
    }
  }

  return (
    <div className={styles.container}>
      { showError &&
        <div>
          <span>Uh oh! Looks like there was an error. Click the button to try again.</span>
        </div>
      }

      <div className={styles.mainContent}>
          <h2 className={styles.headline}>Almost there!</h2>
          <h2 className={classNames(styles.headline, styles.subhead)}>Start your free trial of <span className={styles.bold}>X-ray Standard</span>.</h2>

          <button role="link" className={styles.button} onClick={handleClick}>
            <span className={styles.buttonText}>Subscribe</span>
          </button>
      </div>
    </div>
  )
}
