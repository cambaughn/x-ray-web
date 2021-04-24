import React, { useEffect } from 'react';
import styles from './Search.module.scss';
import { useSelector } from 'react-redux';


// Components

// Utility functions
import analytics from '../../util/analytics/segment';

export default function Search({}) {
  const user = useSelector(state => state.user);
  const onFreeTrial = useSelector(state => state.onFreeTrial);

  const recordPageView = () => {
    analytics.page({
      userId: user.id,
      category: 'Search',
      name: 'Search',
      properties: {
        url: window.location.href,
        title: 'Search'
      }
    });
  }

  useEffect(recordPageView, []);

  return (
    <div className={styles.container}>
      { onFreeTrial &&
        <div className={styles.trialMessageWrapper}>
          <span className={styles.trialMessage}>Your free trial is now active!</span>
        </div>
      }
      <span className={styles.message}>Type in search bar to find cards</span>
    </div>
  )
}
