import React, { useState, useEffect } from 'react';
import styles from './CardImageUpdate.module.scss';

// Components
import AdminNav from '../AdminNav/AdminNav';

// Utility functions

export default function CardImageUpdate({}) {
  return (
    <div className={styles.container}>
      <AdminNav />
    </div>
  )
}
