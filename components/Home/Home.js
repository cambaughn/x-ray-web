import React from 'react';
import styles from './Home.module.scss';

// Components

// Utility functions

export default function Home({}) {
  return (
    <div className={styles.container}>
      <span className={styles.message}>Type in search bar to find cards</span>
    </div>
  )
}
