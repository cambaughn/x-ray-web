import React from 'react';
import styles from './PaymentSuccess.module.scss';

// Components

// Utility functions

export default function PaymentSuccess({}) {
  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
        <h2 className={styles.headline}>Success!</h2>
        <span className={styles.subhead}>Your subscription is now active. Enjoy X-ray!</span>
        <span className={styles.hint}>You can use the search bar above to find cards</span>
      </div>
    </div>
  )
}
