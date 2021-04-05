import React, { useState, useEffect } from 'react';
import styles from './PaymentPrompt.module.scss';
import StripeCheckout from 'react-stripe-checkout';
import { loadStripe } from '@stripe/stripe-js';
import { createCheckoutSession } from 'next-stripe/client';

// Components

// Utility functions


const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

export default function PaymentPrompt({}) {
  // const handleToken = (token) => {
  //   console.log('got token, ', token);
  // }
  //
  // const setUpSession = async () => {
  //   const session = await stripe.checkout.sessions.create({
  //     payment_method_types: ['card'],
  //     line_items: [{
  //       price: 'price_1HKiSf2eZvKYlo2CxjF9qwbr',
  //       quantity: 1,
  //     }],
  //     mode: 'subscription',
  //     success_url: 'https://example.com/success?session_id={CHECKOUT_SESSION_ID}',
  //     cancel_url: 'https://example.com/cancel',
  //   });
  //
  //   console.log('session ', session);
  // }

  const handleClick = async () => {
    const session = await createCheckoutSession({
      success_url: window.location.href,
      cancel_url: window.location.href,
      line_items: [{ price: "price_1IBGHuIp4rvRKVTPIgaKmH56", quantity: 1 }],
      payment_method_types: ['card'],
      mode: 'subscription'
    })

    const stripe = await stripePromise;

    const result = stripe.redirectToCheckout({ sessionId: session.id })
  }

  return (
    <div className={styles.container}>
      <button role="link" onClick={handleClick}>
        Checkout
      </button>
    </div>
  )
}
