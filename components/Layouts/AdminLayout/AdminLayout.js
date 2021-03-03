import React from 'react';
import styles from './AdminLayout.module.scss';

// Components
import AdminNav from '../../AdminNav/AdminNav';

// Utility functions

export default function AdminLayout({ children }) {
  return (
    <div className={styles.container}>
      <AdminNav />
      {children}
    </div>
  )
}
