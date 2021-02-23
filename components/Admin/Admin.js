import React from 'react';
import styles from './Admin.module.scss';

// Components
import AdminNav from '../AdminNav/AdminNav';

// Utility functions

export default function Admin({}) {
  return (
    <div className={styles.container}>
      <AdminNav />
    </div>
  )
}
