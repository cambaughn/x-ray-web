import React from 'react';
import styles from './Buttons.module.scss';
import Link from 'next/link';


export default function GetStartedButton({}) {
  return (
    <Link href={'/sign-in'}>
      <div className={`${styles.darkButton} ${styles.getStartedButton}`}>
        <span className={styles.getStartedText}>Get Started for Free</span>
      </div>
    </Link>
  )
}
