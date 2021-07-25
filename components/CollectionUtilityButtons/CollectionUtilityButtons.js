import React, { useState, useEffect } from 'react';
import styles from './CollectionUtilityButtons.module.scss';
import { Filter } from 'react-feather';

// Components

// Utility functions

export default function CollectionUtilityButtons({}) {
  const showText = true;

  return (
    <div className={styles.container}>
      <div className={styles.utilityButton}>
        { showText &&
          <span className={styles.buttonText}>Sort</span>
        }
        <Filter className={styles.icon} size={16} />
      </div>
    </div>
  )
}
