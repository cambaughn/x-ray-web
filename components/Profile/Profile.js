import React, { useState, useEffect } from 'react';
import styles from './Profile.module.scss';
import { useSelector } from 'react-redux';

// Components
import UserCollection from '../UserCollection/UserCollection';

// Utility functions

export default function Profile({ username }) {
  const user = useSelector(state => state.user);
  const [isCurrentUser, setIsCurrentUser] = useState(true);

  const determineCurrentUser = () => {
    setIsCurrentUser(username === user.username);
  }

  useEffect(determineCurrentUser, [username]);

  return (
    <UserCollection username={username} isCurrentUser={isCurrentUser} />
  )
}
