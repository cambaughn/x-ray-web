import React, { useState, useEffect } from 'react';
import styles from './SetInfoCard.module.scss';
import Link from 'next/link';
import { useSelector } from 'react-redux';

// Components

// Utility functions
import { shortenSetName } from '../../util/helpers/string';


export default function SetInfoCard({ set }) {
  const user = useSelector(state => state.user);

  return (
    <Link href={`/set/${set.id}`}>
      <div className={styles.setCard}>
        { (!set.psa_pop_urls || set.psa_pop_urls.length === 0) && user.role === 'admin' &&
          <span className={styles.noPopIndicator}>*</span>
        }
        <div className={styles.setLogoWrapper}>
          <img src={set.images.logo} className={styles.setLogo} />
        </div>
        <span className={styles.setName}>{shortenSetName(set.name)}</span>
      </div>
    </Link>
  )
}
