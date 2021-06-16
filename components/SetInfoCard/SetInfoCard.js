import React, { useState, useEffect } from 'react';
import styles from './SetInfoCard.module.scss';
import Link from 'next/link';

// Components

// Utility functions
import { shortenSetName } from '../../util/helpers/string';


export default function SetInfoCard({ set }) {
  return (
    <Link href={`/set/${set.id}`}>
      <div className={styles.setCard}>
        <div className={styles.setLogoWrapper}>
          <img src={set.images.logo} className={styles.setLogo} />
        </div>
        <span className={styles.setName}>{shortenSetName(set.name)}</span>
      </div>
    </Link>
  )
}