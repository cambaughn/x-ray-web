import React, { useState, useEffect } from 'react';
import styles from './GettingDataMessage.module.scss';
import classNames from 'classnames';

// Components

// Utility functions

export default function GettingDataMessage({}) {
  return (
    <div className={styles.container}>
      <h4 className={styles.title}>Hang in there!</h4>
      <span className={classNames(styles.body, styles.spacing)}>We're still getting data for some cards in your collection.</span>
      <span className={styles.body}>This may take a bit, but we're on it.</span>
    </div>
  )
}
