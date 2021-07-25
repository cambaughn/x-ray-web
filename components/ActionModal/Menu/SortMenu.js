import React, { useState, useEffect } from 'react';
import styles from './Menu.module.scss';
import classNames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import { Check } from 'react-feather';

// Components

// Utility functions
import { setCollectionSortOptions } from '../../../redux/actionCreators';


export default function SortMenu({}) {
  const collectionSortOptions = useSelector(state => state.collectionSortOptions);
  const dispatch = useDispatch();

  const handleGroupToggle = () => {
    let updates = { ...collectionSortOptions };
    updates.groupBySet = !updates.groupBySet;
    dispatch(setCollectionSortOptions(updates));
  }

  return (
    <div className={classNames(styles.sortWrapper, styles.container)}>
      <h3 className={styles.title}>Sort & Filter</h3>
      <div className={styles.toggleGroup}>
        <span className={styles.toggleText}>Group by set</span>
        <div className={classNames(styles.checkBox, { [styles.checkBoxChecked]: collectionSortOptions.groupBySet })} onClick={handleGroupToggle}>
          { collectionSortOptions.groupBySet &&
            <Check className={styles.checkIcon} size={18} />
          }
        </div>
      </div>
    </div>
  )
}
