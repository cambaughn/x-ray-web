import React from 'react';
import styles from './AdminNav.module.scss';

// Components
import AdminNavButton from './AdminNavButton';

// Utility functions

export default function AdminNav({}) {
  return (
    <div className={styles.container}>
      <AdminNavButton text={'Admin Home'} linkTo={'/admin'} />
      <AdminNavButton text={'Card Images'} linkTo={'/admin/card-images'} />
    </div>
  )
}
