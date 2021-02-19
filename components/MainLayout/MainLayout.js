import React from 'react';
import styles from './MainLayout.module.scss';

// Components
import NavBar from '../NavBar/NavBar';

// Utility functions

export default function MainLayout({ children }) {
  return (
    <div className={styles.container}>
      <NavBar />
      {children}
    </div>
  )
}
