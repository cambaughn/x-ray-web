import React, { useState, useEffect } from 'react';
import styles from './UserCollection.module.scss';
import { useSelector, useDispatch } from 'react-redux';

// Components

// Utility functions

export default function UserCollection({}) {
  const user = useSelector(state => state.user);
  const collectedItems = useSelector(state => state.collectedItems);

  return (
    <div className={styles.container}>
      <h3 className={styles.name}>{user.name}</h3>
      <span className={styles.username}>@{user.username}</span>
    </div>
  )
}
