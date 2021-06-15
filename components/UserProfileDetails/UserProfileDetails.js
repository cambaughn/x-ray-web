import React, { useState, useEffect } from 'react';
import styles from './UserProfileDetails.module.scss';

// Components

// Utility functions

export default function UserProfileDetails({ user = {} }) {
  return (
    <div className={styles.container}>
      <h3 className={styles.name}>{user.name}</h3>
      <span className={styles.username}>@{user.username}</span>
    </div>
  )
}
