import React from 'react';
import styles from './Buttons.module.scss';
import Link from 'next/link';


export default function GetStartedButton({}) {
  return (
    <Link href={'/sign-in'}>
      <div className={`${styles.darkButton} ${styles.signInButton}`}>
        <span className={styles.signInText}>Sign In</span>
      </div>
    </Link>
  )
}
