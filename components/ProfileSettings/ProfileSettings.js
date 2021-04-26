import React, { useState, useEffect } from 'react';
import styles from './ProfileSettings.module.scss';
import { useSelector } from 'react-redux';
import classNames from 'classnames';

// Components

// Utility functions

export default function ProfileSettings({}) {
  const user = useSelector(state => state.user);
  const onFreeTrial = useSelector(state => state.onFreeTrial);
  const subscriptionStatus = useSelector(state => state.subscriptionStatus);
  const [subscriptionText, setSubscriptionText] = useState('');

  const determineSubscriptionStatus = () => {
    if (onFreeTrial) {
      setSubscriptionText('Free trial');
    } else if (user.role === 'admin' || user.role === 'contributor') {
      setSubscriptionText(user.role);
    } else if (subscriptionStatus === 'active') {
      setSubscriptionText('Subscribed');
    } else {
      setSubscriptionText('Not subscribed');
    }
  }

  useEffect(determineSubscriptionStatus, [user, onFreeTrial, subscriptionStatus]);

  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
        <h2 className={styles.heading}>Settings</h2>

        <div className={styles.settingWrapper}>
          <span className={styles.label}>Subscription</span>
          <span className={classNames({ [styles.status]: true, [styles.active]: subscriptionText !== 'Not subscribed', [styles.inactive]: subscriptionText === 'Not subscribed' })}>{subscriptionText}</span>
          { subscriptionStatus === 'active' &&
            <div className={styles.cancelButton}>
              <span className={styles.cancelText}>cancel</span>
            </div>
          }
        </div>
      </div>
    </div>
  )
}
