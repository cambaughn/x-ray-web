import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import styles from './PaymentPrompt.module.scss';
import StripeCheckout from 'react-stripe-checkout';
import { loadStripe } from '@stripe/stripe-js';
import { createCheckoutSession } from 'next-stripe/client';

// Components

// Utility functions


const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

export default function PaymentPrompt({}) {
  const [showError, setShowError] = useState(false);
  const user = useSelector(state => state.user);

  const handleClick = async () => {
    const session = await createCheckoutSession({
      customer_email: user.email || null,
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
  }

  const checkCustomer = async () => {
    const stripe = await stripePromise;

    console.log('customer ', customer);
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
