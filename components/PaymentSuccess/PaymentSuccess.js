import React, { useState, useEffect } from 'react';
import styles from './PaymentSuccess.module.scss';
import { useSelector } from 'react-redux';

// Components

// Utility functions
import analytics from '../../util/analytics/segment';

export default function PaymentSuccess({}) {
  const user = useSelector(state => state.user);
  const [firstVisit, setFirstVisit] = useState(true);

  const recordSubscription = () => {
    if (firstVisit) {
      setFirstVisit(false);
      analytics.track({
        userId: user.id,
        event: 'Subscribed'
      });
    }
  }

  useEffect(recordSubscription, []);
  
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
