import React, { useState, useEffect } from 'react';
import styles from './NoDataMessage.module.scss';
import classNames from 'classnames';

// Components

// Utility functions

export default function NoDataMessage({}) {
  return (
    <div className={styles.container}>
      <h4 className={styles.title}>Hang in there!</h4>
      <span className={classNames(styles.body, styles.spacing)}>We're still working on getting some data for this card.</span>
      <span className={styles.body}>In the meantime, you can still add it to your collection.</span>
    </div>
  )
}
