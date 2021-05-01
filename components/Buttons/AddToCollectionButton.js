import React from 'react';
import styles from './Buttons.module.scss';
import { Plus } from 'react-feather';


export default function AddToCollectionButton({ clickHandler }) {
  return (
    <div className={`${styles.darkButton} ${styles.addButton}`} onClick={clickHandler}>
      <Plus className={styles.plusIcon} size={20} />
    </div>
  )
}
