import React, { useState, useEffect } from 'react';
import styles from './Menu.module.scss';
import classNames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import * as icons from 'react-feather';

// Components

// Utility functions
import { setCollectionSortOptions, setActionModalStatus } from '../../../redux/actionCreators';
import { localStorageKeys } from '../../../util/localStorage';


export default function SortMenu({}) {
  const collectionSortOptions = useSelector(state => state.collectionSortOptions);
  const dispatch = useDispatch();

  const sortButtons = [
    { text: 'Date added', icon: 'Calendar', sortBy: 'date' },
    { text: 'Value', icon: 'DollarSign', sortBy: 'value' },
  ]

  const orderButtons = [
    { text: 'Descending', icon: 'ArrowDown', sortOrder: 'desc' },
    { text: 'Ascending', icon: 'ArrowUp', sortOrder: 'asc' }
  ]

  const handleGroupToggle = () => {
    let updates = { ...collectionSortOptions };
    updates.groupBySet = !updates.groupBySet;
    dispatch(setCollectionSortOptions(updates));
    saveSortOptionsLocally(updates);
  }

  const handleSortByClick = (sortBy) => {
    let updates = { ...collectionSortOptions };
    updates.sortBy = sortBy;
    dispatch(setCollectionSortOptions(updates));
    saveSortOptionsLocally(updates);
  }

  const handleSortOrderClick = (sortOrder) => {
    let updates = { ...collectionSortOptions };
    updates.sortOrder = sortOrder;
    dispatch(setCollectionSortOptions(updates));
    saveSortOptionsLocally(updates);
  }

  const saveSortOptionsLocally = (options) => {
    window.localStorage.setItem(localStorageKeys.collectionSortOptions, JSON.stringify(options));
  }

  const renderIcon = (name) => {
    let IconComponent = icons[name];
    return <IconComponent className={styles.sortIcon} size={16} />
  }

  const closeModal = () => {
    dispatch(setActionModalStatus(''));
  }

  return (
    <div className={classNames(styles.sortWrapper, styles.container)}>
      <div className={styles.mainContent}>
        <h3 className={styles.title}>Sort & Filter</h3>
        <div className={styles.toggleGroup}>
          <span className={classNames(styles.label, styles.toggleText)}>Group by set</span>
          <div className={classNames(styles.checkBox, { [styles.checkBoxChecked]: collectionSortOptions.groupBySet })} onClick={handleGroupToggle}>
            { collectionSortOptions.groupBySet &&
              <icons.Check className={styles.checkIcon} size={18} />
            }
          </div>
        </div>

        <span className={classNames(styles.label, styles.sortLabel)}>Sort by:</span>
        <div className={classNames(styles.sortButtons, styles.sortSection)}>

          { sortButtons.map(button => {
            return (
              <div className={classNames(styles.sortButton, { [styles.sortButtonSelected]: collectionSortOptions.sortBy === button.sortBy, [styles.sortButtonUnselected]: collectionSortOptions.sortBy !== button.sortBy })} onClick={() => handleSortByClick(button.sortBy)}>
                { renderIcon(button.icon) }
                <span className={styles.sortButtonText}>{button.text}</span>
              </div>
            )
          })}
        </div>

        <span className={classNames(styles.label, styles.sortLabel)}>Order</span>

        <div className={classNames(styles.orderButtons, styles.sortSection)}>
          { orderButtons.map(button => {
            return (
              <div className={classNames(styles.sortButton, { [styles.sortButtonSelected]: collectionSortOptions.sortOrder === button.sortOrder, [styles.sortButtonUnselected]: collectionSortOptions.sortOrder !== button.sortOrder })} onClick={() => handleSortOrderClick(button.sortOrder)} key={button.text}>
                { renderIcon(button.icon) }
                <span className={styles.sortButtonText}>{button.text}</span>
              </div>
            )
          })}
        </div>
      </div>

      <div className={styles.bottomButtonWrapper}>
        <div className={styles.bottomButton} onClick={closeModal}>
          <span className={styles.bottomButtonText}>Done</span>
        </div>
      </div>
    </div>
  )
}
