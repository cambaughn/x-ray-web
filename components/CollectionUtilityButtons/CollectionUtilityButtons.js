import React, { useState, useEffect } from 'react';
import styles from './CollectionUtilityButtons.module.scss';
import { Grid } from 'react-feather';
import { useDispatch } from 'react-redux';

// Components

// Utility functions
import { setActionModalStatus } from '../../redux/actionCreators';

export default function CollectionUtilityButtons({}) {
  const showText = true;
  const dispatch = useDispatch();

  const openSortMenu = () => {
    dispatch(setActionModalStatus('sort'));
  }

  return (
    <div className={styles.container}>
      <div className={styles.utilityButton} onClick={openSortMenu}>
        { showText &&
          <span className={styles.buttonText}>Sort</span>
        }
        <Grid className={styles.icon} size={16} />
      </div>
    </div>
  )
}
