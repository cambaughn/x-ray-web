import React, { useState, useEffect } from 'react';
import styles from './ProfileSettings.module.scss';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import axios from 'axios';

// Components
import FullScreenModal from '../Modal/FullScreenModal';
import LoadingSpinner from '../Icons/LoadingSpinner';

// Utility functions

export default function ProfileSettings({}) {
  const user = useSelector(state => state.user);
  const onFreeTrial = useSelector(state => state.onFreeTrial);
  const subscriptionStatus = useSelector(state => state.subscriptionStatus);
  const [subscriptionText, setSubscriptionText] = useState('');
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmingCancellation, setConfirmingCancellation] = useState(false);
  const [canceled, setCanceled] = useState(false);
  const [cancellationError, setCancellationError] = useState(false);

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

  const toggleModal = () => {
    setShowConfirmationModal(!showConfirmationModal);
    setConfirmingCancellation(false);
  }


  const handleConfirm = async () => {
    try {
      setConfirmingCancellation(true);
      if (!!user.username) { // if user is signed in
        let customer_id = window.location.hostname === 'localhost' ? user.test_stripe_customer_id : user.stripe_customer_id;
        customer_id = customer_id || null;

        if (customer_id) {
          const { data } = await axios.post(`${window.location.origin}/api/subscription/cancel`, { customer_id });
          let canceled = data.canceled;

          if (canceled) {
            setCanceled(true);
            setTimeout(toggleModal, 3000);
            return;
          }
        }
      }

      setCancellationError(true);
      setTimeout(toggleModal, 3000);
    } catch (error) {
      setCancellationError(true);
      setTimeout(toggleModal, 3000);
      console.error(error);
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
          { subscriptionText === 'Subscribed' &&
            <div className={styles.cancelSubscriptionButton} onClick={() => setShowConfirmationModal(true)}>
              <span className={styles.cancelText}>cancel</span>
            </div>
          }
        </div>
      </div>

      { showConfirmationModal &&
        <FullScreenModal toggleModal={!confirmingCancellation ? toggleModal : null}>
          <div className={styles.confirmationModal}>

            <div className={styles.cancelTextWrapper}>
              <h2 className={styles.confirmHeading}>Cancel Subscription</h2>
              <span className={styles.promptText}>Are you sure you want to cancel your X-ray subscription?</span>
            </div>


            { !confirmingCancellation && !canceled &&
              <div className={styles.buttons}>
                <div className={classNames(styles.button, styles.cancelButton)} onClick={toggleModal}>
                  <span className={classNames(styles.buttonText, styles.cancelButtonText)}>No thanks, take me back</span>
                </div>

                <div className={classNames(styles.button, styles.confirmButton)} onClick={handleConfirm}>
                  <span className={classNames(styles.buttonText, styles.confirmButtonText)}>Yes, I'm sure</span>
                </div>
              </div>
            }

            { confirmingCancellation && !canceled &&
              <div className={styles.confirmationWrapper}>
                <LoadingSpinner color={'black'} />
                <span className={styles.confirmingText}>Confirming cancellation...</span>
              </div>
            }

            { canceled &&
              <div className={styles.canceledWrapper}>
                <span>Subscription canceled successfully.</span>
              </div>
            }

            { cancellationError &&
              <div className={styles.canceledWrapper}>
                <span className={styles.errorMessage}>There's been an error</span>
                <span className={styles.errorMessage}>If the problem persists, please email support@x-ray.fun</span>
              </div>
            }

          </div>
        </FullScreenModal>
      }
    </div>
  )
}
