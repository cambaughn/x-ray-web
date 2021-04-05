import React, { useState, useEffect } from 'react';
import styles from './PaymentPrompt.module.scss';
import StripeCheckout from 'react-stripe-checkout';
const stripe = require('stripe')('sk_test_4eC39HqLyjWDarjtT1zdp7dc');

// Components

// Utility functions

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


  return (
    <div className={styles.container}>
      <button id="checkout-button">Checkout</button>
    </div>
  )
}
