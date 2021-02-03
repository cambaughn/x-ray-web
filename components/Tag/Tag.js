import React from 'react';

// Styles
import styles from './Tag.module.scss';

export default function Tag({ text, color }) {
  return (
    <div className={styles.container} style={{ backgroundColor: color || '#bdc3c7' }}>
      <span className={styles.text}>{text}</span>
    </div>
  )
}
