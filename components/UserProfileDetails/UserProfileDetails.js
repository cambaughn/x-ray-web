import React, { useState, useEffect } from 'react';
import styles from './UserProfileDetails.module.scss';
import Link from 'next/link';

// Components

// Utility functions

export default function UserProfileDetails({ user = {} }) {
  return (
    <div className={styles.container}>
      <div className={styles.leftSide}>
        <h3 className={styles.name}>{user.name}</h3>
        <span className={styles.username}>@{user.username}</span>
      </div>

      {/* <div className={styles.rightSide}>
        <Link href={`/sell-cards`}>
          <div className={styles.sellButton}>
            <span>Sell Cards</span>
          </div>
        </Link>
      </div> */}
    </div>
  )
}
