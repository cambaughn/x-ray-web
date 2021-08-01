import React from 'react';
import styles from './Buttons.module.scss';
import { Plus } from 'react-feather';
import { useSelector, useDispatch } from 'react-redux';

// Utility functions
import { setActionModalStatus } from '../../redux/actionCreators';


export default function AddToCollectionButton({ handleClick, showHelpText }) {
  const dispatch = useDispatch();

  const openAddSingleCardMenu = () => {
    dispatch(setActionModalStatus('addSingleCard'));
  }

  return (
    <div className={`${styles.darkButton} ${styles.addButton}`} onClick={openAddSingleCardMenu}>
      <Plus className={styles.plusIcon} size={20} />
      { showHelpText &&
        <span className={styles.addToCollectionText}>Add to collection</span>
      }

      <div className={styles.shortcutTextWrapper}>
        <span className={styles.shortcutText}>shortcut:</span>
        <span className={styles.shortcutBox}>a</span>
      </div>
    </div>
  )
}
