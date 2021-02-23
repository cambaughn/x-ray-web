import React from 'react';
import styles from './AdminNavButton.module.scss';
import Link from 'next/link';

// Components

// Utility functions

export default function AdminNavButton({ icon, text, linkTo }) {
  return (
    <Link href={linkTo}>
      <div className={styles.linkWrapper}>
        <span className={styles.text}>{text}</span>
      </div>
    </Link>
  )
}
