import React, { useState } from 'react';
import styles from './SignIn.module.scss';
import validator from 'email-validator';
import { Check } from 'react-feather';

// Components

// Utility functions

export default function SignIn({}) {
  const [email, setEmail] = useState('');
  const [buttonActive, setButtonActive] = useState(false);

  const updateEmail = (string) => {
    validator.validate(string) ? setButtonActive(true) : setButtonActive(false);
    setEmail(string);
  }

  const handleSubmit = () => {
    if (buttonActive) {

    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
        <h2 className={styles.headline}>Ready to be the very best?</h2>
        <h2 className={`${styles.headline} ${styles.subhead}`}>Let's get you signed in.</h2>

        <div className={styles.inputWrapper}>
          <input
            type="email"
            value={email}
            onChange={event => updateEmail(event.target.value)}
            className={styles.emailInput}
            placeholder={'email'}
            autoFocus
          />

          <div className={buttonActive ? `${styles.submitButton} ${styles.submitButtonActive}` : styles.submitButton} onClick={handleSubmit}>
            <Check className={styles.check} size={20} />
          </div>
        </div>
      </div>

    </div>
  )
}
