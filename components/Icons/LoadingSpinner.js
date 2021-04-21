import React from 'react';
import styles from './LoadingSpinner.module.scss';
import { Loader } from 'react-feather';
import classNames from 'classnames';

// Components

// Utility functions

export default function LoadingSpinner({ color }) {
  return (
    <Loader className={styles.loader} style={{ color }} size={20} />
  )
}
