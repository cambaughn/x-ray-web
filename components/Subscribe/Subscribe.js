import React from 'react';
import styles from './Subscribe.module.scss';
import { Elements } from '@stripe/react-stripe-js';

// Components
import PaymentForm from '../PaymentForm/PaymentForm';

// Utility functions
import stripePromise from '../../util/stripe/stripeInit.js'

export default function Subscribe({}) {
  return (
    <div className={styles.container}>
      <h3>need to subscribe pls</h3>
      <Elements stripe={stripePromise}>
        <PaymentForm />
      </Elements>
    </div>
  )
}
