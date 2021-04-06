import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import styles from './PaymentPrompt.module.scss';
import StripeCheckout from 'react-stripe-checkout';
import { loadStripe } from '@stripe/stripe-js';
import { createCheckoutSession } from 'next-stripe/client';
import axios from 'axios';

// Components

// Utility functions
import userAPI from '../../util/api/user';


const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

export default function PaymentPrompt({}) {
  const [showError, setShowError] = useState(false);
  const user = useSelector(state => state.user);

  const createCustomer = async () => {
    try {
      const { data } = await axios.post(`${window.location.origin}/api/create_customer`, { email: user.email, name: user.name });
      let { customer } = data;
      console.log('created customer ==>', customer);

      await userAPI.update(user.id, { stripe_customer_id: customer.id });

      return Promise.resolve(customer.id);
    } catch (error) { // Not subscribed

    }
  }

  const handleClick = async () => {
    // TODO: Need to create a Customer via Stripe so I can connect the subscription to them.

    try {
      let customerId = await createCustomer();

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

      if (result.error) {
        setShowError(true);
      }
    } catch(error) {

    }
  }

  return (
    <div className={styles.container}>
      { showError &&
        <div>
          <span>Uh oh! Looks like there was an error. Click the button to try again.</span>
        </div>
      }
      <button role="link" onClick={handleClick}>
        Checkout
      </button>
    </div>
  )
}
