import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
// Share styles with sign in page
import styles from './AccountSetup.module.scss';

// Components

// Utility functions
import userAPI from '../../util/api/user';

export default function AccountSetup({ }) {
  const [name, setName] = useState('');
  const [username, setUserName] = useState('');
  const router = useRouter();
  const usernameInput = useRef(null);

  const focusUsernameInput = (event) => {
    if (event.key === 'Enter'){
      usernameInput.current.focus();
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
        <h2 className={styles.headline}>First things first, let's get your account details set up.</h2>
        {/* <Link href={'/sign-in'}><h2 className={classNames(styles.headline, styles.subhead, styles.link)}>Click here to go back to sign in.</h2></Link> */}

        <div className={styles.inputGroup}>
          <span className={styles.label}>Name</span>
          <input
            type="text"
            value={name}
            onChange={event => setName(event.target.value)}
            onKeyDown={focusUsernameInput}
            className={styles.textInput}
            placeholder={'Your real name'}
            autoFocus
          />
        </div>

        <div className={styles.inputGroup}>
          <span className={styles.label}>Username</span>
          <input
            type="text"
            value={username}
            onChange={event => setUserName(event.target.value)}
            className={styles.textInput}
            placeholder={'Your username'}
            ref={usernameInput}
          />
        </div>
      </div>
    </div>
  )
}
