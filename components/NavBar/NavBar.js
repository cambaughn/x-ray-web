import React from 'react';
import styles from './NavBar.module.scss';
import Link from 'next/link';

// Components

// Utility functions

export default function NavBar({}) {
  return (
    <div className={styles.container}>
      <Link href="/">
        <img src={'/images/brand.png'} alt={'wordmark'} className={styles.brand} />
      </Link>
    </div>
  )
}
