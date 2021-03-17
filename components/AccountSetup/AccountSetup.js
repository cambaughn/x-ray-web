import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Check, Loader } from 'react-feather';
import styles from './AccountSetup.module.scss';
import { useSelector, useDispatch } from 'react-redux';

// Components

// Utility functions
import userAPI from '../../util/api/user';
import { usernameAvailable, addUserToIndex } from '../../util/algolia/algoliaHelpers';
import { setUser } from '../../redux/actionCreators';

export default function AccountSetup({ }) {

  const [name, setName] = useState('');
  const [username, setUserName] = useState('');
  const [checkedUsernameAvail, setCheckedUsernameAvail] = useState(false);
  const [usernameIsAvailable, setUsernameIsAvailable] = useState(true);
  const [canSubmit, setCanSubmit] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const router = useRouter();
  const usernameInput = useRef(null);
  // Redux
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();

  const focusUsernameInput = (event) => {
    if (event.key === 'Enter'){
      usernameInput.current.focus();
    }
  }

  const checkUserName = async () => {
    if (username.length > 0) {
      let available = await usernameAvailable(username);
      setUsernameIsAvailable(available);
      setCheckedUsernameAvail(true);
    } else {
      setCheckedUsernameAvail(false);
    }
  }

  const checkSubmissionStatus = () => {
    setCanSubmit(!submitted && username.length > 0 && name.length > 0 && usernameIsAvailable)
  }

  const handleSubmit = async () => {
    try {
      if (canSubmit) {
        await userAPI.update(user.id, { name, username });
        let updatedUser = await userAPI.get(user.id);
        dispatch(setUser(updatedUser));
        addUserToIndex(updatedUser);
      }
    } catch(error) {
      console.error(error);
    }
  }

  // TODO: set up algolia and db update logic
  useEffect(checkUserName, [username]);
  useEffect(checkSubmissionStatus, [username, name, usernameIsAvailable])

  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
        <h2 className={styles.headline}>First things first, let's get your account details set up.</h2>
        {/* <Link href={'/sign-in'}><h2 className={classNames(styles.headline, styles.subhead, styles.link)}>Click here to go back to sign in.</h2></Link> */}

        <div className={styles.inputGroup}>
          <div className={styles.labelWrapper}>
            <span className={styles.label}>Name</span>
          </div>
          <input
            type="text"
            value={name}
            onChange={event => setName(event.target.value)}
            onKeyDown={focusUsernameInput}
            className={styles.textInput}
            placeholder={'Name'}
            autoFocus
          />
        </div>

        <div className={styles.inputGroup}>
          <div className={styles.labelWrapper}>
            <span className={styles.label}>Username</span>
            { checkedUsernameAvail &&
              <span className={classNames({ [styles.usernameStatus]: true, [styles.available]: usernameIsAvailable })}>{usernameIsAvailable ? 'available' : 'already taken'}</span>
            }
          </div>
          <input
            type="text"
            value={username}
            onChange={event => setUserName(event.target.value.trim())}
            className={styles.textInput}
            placeholder={'Username'}
            ref={usernameInput}
          />
        </div>


        <div className={classNames({ [styles.submitButton]: true, [styles.canSubmit]: canSubmit })} onClick={handleSubmit}>
          { !submitted
            ? <Check className={classNames(styles.icon, styles.check)} size={20} />
            : <Loader className={classNames(styles.icon, styles.loader)} size={20} />
          }
        </div>
      </div>
    </div>
  )
}
