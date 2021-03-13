import React, { useState } from 'react';
import styles from './SignIn.module.scss';
import validator from 'email-validator';
import classNames from 'classnames';
import { Check, Send } from 'react-feather';

// Components

// Utility functions
import { sendEmailLink } from '../../util/firebase/firebaseAuth';

export default function SignIn({}) {
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [buttonActive, setButtonActive] = useState(false);

  const updateEmail = (string) => {
    validator.validate(string) ? setButtonActive(true) : setButtonActive(false);
    setEmail(string);
  }

  const handleSubmit = async () => {
    try {
      if (buttonActive && !emailSent) {
        await sendEmailLink(email);
        console.log('sent authentication email');
        setEmailSent(true);
      }
    } catch(error) {
      console.error(error);
      setEmailSent(false);
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


        { !emailSent &&
          <div className={styles.inputWrapper}>
            <input
              type="email"
              value={email}
              onChange={event => updateEmail(event.target.value)}
              className={styles.emailInput}
              placeholder={'email'}
              autoFocus
            />
              <div className={classNames({[styles.submitButton]: true, [styles.submitButtonActive]: buttonActive})} onClick={handleSubmit}>
                <Send className={classNames(styles.icon, styles.send)} size={20} />
              </div>
          </div>
        }
      </div>

    </div>
  )
}
