import React, { useState, useEffect } from 'react';
import styles from './CollectionStats.module.scss';
import { Package } from 'react-feather';

// Components

// Utility functions

export default function CollectionStats({ numCards }) {
  return (
    <div className={styles.container}>
      <div className={styles.statsBlock}>
        <Package className={styles.icon} size={30} />

        <div className={styles.detailsWrapper}>
          <span className={styles.dataPoint}>{numCards}</span>
          <span className={styles.dataLabel}>cards collected</span>
        </div>
      </div>
    </div>
  )
}
