import React, { useState, useEffect } from 'react';
import styles from './Profile.module.scss';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';

// Components
import UserCollection from '../UserCollection/UserCollection';

// Utility functions

export default function Profile({ username }) {
  const user = useSelector(state => state.user);
  const router = useRouter();
  const [isCurrentUser, setIsCurrentUser] = useState(false);

  const redirectToUsername = () => {
    if (!username) {
      let updatedUrl = `${window.location.origin}/collection/${user.username}`;
      router.push(updatedUrl);
    }
  }
  const determineCurrentUser = () => {
    setIsCurrentUser(username === user.username);
  }

  // useEffect(determineCurrentUser, [username]);
  useEffect(redirectToUsername);


  return (
    <UserCollection username={username} isCurrentUser={username === user.username} />
  )
}
