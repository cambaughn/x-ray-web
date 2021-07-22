import React, { useState, useEffect } from 'react';
import styles from './Loading.module.scss';

// Components

// Utility functions

export default function Loading({}) {
  return (
    <div className={styles.container}>
      <img src={'/images/pokeball-loading-icon.png'} alt={'black and white pokeball used as a loading spinner'} className={styles.loadingIcon} />
    </div>
  )
}
