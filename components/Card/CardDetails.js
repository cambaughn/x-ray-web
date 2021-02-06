import React from 'react';
import styles from './CardDetails.module.scss';

// Components

// Utility functions

export default function CardDetails({ card_id }) {
  return (
    <div className={styles.container}>
      <h3>Card Details for: {card_id}</h3>
    </div>
  )
}
