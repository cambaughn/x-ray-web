import React, { useState, useEffect } from 'react';
import styles from './PaymentForm.module.scss';
import {
  CardElement,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useElements,
  useStripe
} from '@stripe/react-stripe-js';
import axios from 'axios';

// Components

// Utility functions


// Custom styling can be passed to options when creating an Element.
const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#32325d',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4'
      }
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a'
    }
  }
};

export default function PaymentForm({ }) {
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  // Handle real-time validation errors from the card Element.
  const handleChange = (event) => {
    if (event.error) {
      setError(event.error.message);
    } else {
      setError(null);
    }
  }

  // Handle form submission.
  const handleSubmit = async (event) => {

    // Block native form submission.
    event.preventDefault();
    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }

    if (!submitting) {
      // Set submitting so the user can't hit the button multiple times
      setSubmitting(true);

      // Get a reference to a mounted CardElement. Elements knows how
      // to find your CardElement because there can only ever be one of
      // each type of element.
      const cardElement = elements.getElement(CardElement);

      // Use your card Element with other Stripe.js APIs
      const {error, paymentMethod} = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (!error) {
        console.log('[PaymentMethod]', paymentMethod);
        const { id } = paymentMethod;
        const { data } = await axios.post("http://localhost:5000/api/charge", { id, amount: 1000 });

        console.log('response ', data);
      } else {
        console.log('[error]', error);
      }
    }
  };


  return (
    <form onSubmit={handleSubmit}>
      <div className="form-row">
        <label htmlFor="card-element">
          Credit or debit card
        </label>
        <CardElement
          id="card-element"
          options={CARD_ELEMENT_OPTIONS}
          onChange={handleChange}
        />
        {/* <CardNumberElement
          id="card-number-element"
          options={CARD_ELEMENT_OPTIONS}
          onChange={handleChange}
        />
        <CardExpiryElement
          id="card-expiry-element"
          options={CARD_ELEMENT_OPTIONS}
          onChange={handleChange}
        />
        <CardCvcElement
          id="card-cvc-element"
          options={CARD_ELEMENT_OPTIONS}
          onChange={handleChange}
        /> */}
        <div className="card-errors" role="alert">{error}</div>
      </div>
      <button type="submit" className={styles.submitButton}>Submit Payment</button>
    </form>
  )
}
