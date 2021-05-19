import React, { useState, useEffect } from 'react';
import styles from './UserCollection.module.scss';
import { useSelector, useDispatch } from 'react-redux';

// Components
import CollectionList from '../CollectionList/CollectionList';
import CollectionChart from '../CollectionChart/CollectionChart';
import GettingDataMessage from '../GettingDataMessage/GettingDataMessage';

// Utility functions

export default function UserCollection({}) {
  const user = useSelector(state => state.user);

  return (
    <div className={styles.container}>

      <div className={styles.profileDetails}>
        <h3 className={styles.name}>{user.name}</h3>
        <span className={styles.username}>@{user.username}</span>
      </div>

      <CollectionChart />

      <GettingDataMessage />

      <CollectionList />
    </div>
  )
}
