import React, { useState, useEffect } from 'react';
import styles from './SignIn.module.scss';
import validator from 'email-validator';
import classNames from 'classnames';
import { Loader, Send } from 'react-feather';

// Components

// Utility functions
import { sendEmailLink } from '../../util/firebase/firebaseAuth';
import { localStorageKeys } from '../../util/localStorage';

export default function SignIn({}) {
  const [email, setEmail] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [buttonActive, setButtonActive] = useState(false);

  const updateEmail = (string) => {
    validator.validate(string) ? setButtonActive(true) : setButtonActive(false);
    setEmail(string);
  }

  const handleSubmit = async () => {
    try {
      if (buttonActive && !sendingEmail) {
        // Set the spinner state
        setSendingEmail(true);
        // Send the email via Firebase
        await sendEmailLink(email.trim());
        // Set the state to show the sent email messaging
        setEmailSent(true);
        console.log('sent authentication email');
      }
    } catch(error) {
      console.error(error);
      setEmailSent(false);
    }
  }

  const handleEnterKey = (event) => {
    if (event.key === 'Enter'){
      handleSubmit();
    }
  }


  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
        <h2 className={styles.headline}>{emailSent ? 'Almost there!' : 'Ready to be the very best?'}</h2>
        { emailSent
          ? <h2 className={classNames(styles.headline, styles.subhead)}>We've sent a sign-in email to you at <span className={styles.email}>{email}</span> <span aria-label="thumbs up" role="img">👍</span></h2>
          : <h2 className={classNames(styles.headline, styles.subhead)}>Let's get you signed in.</h2>
        }

        { emailSent &&
          <span className={styles.smallText}>(You can close out of this screen)</span>
        }


        { !emailSent &&
          <div className={styles.inputWrapper}>
            <input
              type="email"
              value={email}
              onChange={event => updateEmail(event.target.value)}
              onKeyDown={handleEnterKey}
              className={styles.emailInput}
              placeholder={'email'}
              autoFocus
            />
              <div className={classNames({[styles.submitButton]: true, [styles.submitButtonActive]: buttonActive})} onClick={handleSubmit}>
                { !sendingEmail
                  ? <Send className={classNames(styles.icon, styles.send)} size={20} />
                  : <Loader className={classNames(styles.icon, styles.loader)} size={20} />
                }
              </div>
          </div>
        }
      </div>

    </div>
  )
}
