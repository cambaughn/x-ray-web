import React, { useState, useEffect } from 'react';
import menuStyles from '../../util/design/ActionMenus.module.scss';
import styles from './SortMenu.module.scss';
import classNames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import * as icons from 'react-feather';
import { SortByAlpha } from '@material-ui/icons';

// Components

// Utility functions
import { setCollectionSortOptions, setActionModalStatus } from '../../redux/actionCreators';
import { localStorageKeys } from '../../util/localStorage';


export default function SortMenu({}) {
  const collectionSortOptions = useSelector(state => state.collectionSortOptions);
  const dispatch = useDispatch();

  const sortButtons = [
    { text: 'Date added', icon: 'Calendar', sortBy: 'date' },
    { text: 'Value', icon: 'DollarSign', sortBy: 'value' },
    { text: 'Alphabetical', sortBy: 'alphabetical' },
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
    return <IconComponent className={menuStyles.iconLeft} size={16} />
  }

  const closeModal = () => {
    dispatch(setActionModalStatus(''));
  }

  return (
    <div className={classNames(menuStyles.container, styles.container)}>
      <div className={styles.mainContent}>
        <h3 className={menuStyles.title}>Sort & Filter</h3>
        <div className={menuStyles.toggleGroup}>
          <p className={classNames(menuStyles.label, menuStyles.labelRightMargin)}>Group by set</p>
          <div className={classNames(menuStyles.checkBox, { [menuStyles.checkBoxChecked]: collectionSortOptions.groupBySet })} onClick={handleGroupToggle}>
            { collectionSortOptions.groupBySet &&
              <icons.Check className={menuStyles.checkIcon} size={18} />
            }
          </div>
        </div>

        <p className={classNames(menuStyles.label, menuStyles.labelBottomMargin)}>Sort by:</p>
        <div className={classNames(menuStyles.flexWrapRow, styles.buttonSection)}>
          { sortButtons.map(button => {
            let isAlphabet = button.sortBy === 'alphabetical';

            return (
              <div className={classNames(menuStyles.smallButton, menuStyles.buttonMarginRight, { [menuStyles.buttonSelected]: collectionSortOptions.sortBy === button.sortBy })} onClick={() => handleSortByClick(button.sortBy)} key={button.text}>
                { !isAlphabet && renderIcon(button.icon) }
                { isAlphabet &&
                  <SortByAlpha className={menuStyles.iconLeft} />
                }
                <span className={menuStyles.smallButtonText}>{button.text}</span>
              </div>
            )
          })}
        </div>

        <p className={classNames(menuStyles.label, menuStyles.labelBottomMargin)}>Order</p>
        <div className={classNames(menuStyles.flexWrapRow, menuStyles.buttonSection)}>
          { orderButtons.map(button => {
            return (
              <div className={classNames(menuStyles.smallButton, menuStyles.buttonMarginRight, { [menuStyles.buttonSelected]: collectionSortOptions.sortOrder === button.sortOrder })} onClick={() => handleSortOrderClick(button.sortOrder)} key={button.text}>
                { renderIcon(button.icon) }
                <span className={menuStyles.smallButtonText}>{button.text}</span>
              </div>
            )
          })}
        </div>
      </div>

      <div className={menuStyles.bottomButtonWrapper}>
        <div className={menuStyles.bottomButton} onClick={closeModal}>
          <span className={menuStyles.bottomButtonText}>Done</span>
        </div>
      </div>
    </div>
  )
}
