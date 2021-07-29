import React, { useState, useEffect } from 'react';
import styles from './PaymentSuccess.module.scss';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';

// Components

// Utility functions
import analytics from '../../util/analytics/segment';

export default function PaymentSuccess({}) {
  const user = useSelector(state => state.user);
  const [firstVisit, setFirstVisit] = useState(true);
  const router = useRouter();

  const recordSubscription = () => {
    if (firstVisit) {
      setFirstVisit(false);
      analytics.track({
        userId: user.id,
        event: 'Subscribed'
      });
    }
  }

  const routeToHome = () => {
    setTimeout(() => {
      router.push('/');
    }, 1500)
  }

  useEffect(recordSubscription, []);
  useEffect(routeToHome, []);

  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
        <h2 className={styles.headline}>Success!</h2>
        <span className={styles.subhead}>Your subscription is now active. Enjoy X-ray!</span>
        <span className={styles.hint}>This page will automatically redirect in a moment</span>
      </div>
    </div>
  )
}
