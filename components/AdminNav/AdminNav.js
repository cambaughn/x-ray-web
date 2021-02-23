import React from 'react';
import styles from './AdminNav.module.scss';

// Components
import AdminNavButton from './AdminNavButton';

// Utility functions

export default function AdminNav({}) {
  return (
    <div className={styles.container}>
      <AdminNavButton text={'Card images'} linkTo={'/admin/card-images'} />
    </div>
  )
}
