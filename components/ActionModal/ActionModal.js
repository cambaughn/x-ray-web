import React, { useState, useEffect } from 'react';
import styles from './ActionModal.module.scss';
import classNames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';

// Components
import SortMenu from './Menu/SortMenu';
import AddCardMenu from '../AddCardMenu/AddCardMenu';

// Utility functions
import { setActionModalStatus } from '../../redux/actionCreators';


/**
  This is a full screen modal that wraps around another component, providing a standard interface.
  It's a floating card with on a transparent background that hovers over the rest of the page.
  @param {function} toggleModal - Gives the ability to toggle on/off
*/

export default function ActionModal({}) {
  const actionModalStatus = useSelector(state => state.actionModalStatus);
  const dispatch = useDispatch();

  const closeModal = () => {
    dispatch(setActionModalStatus(''));
  }

  const stopPropagation = (event) => {
    event.stopPropagation();
  }

  const renderModalContents = () => {
    switch (actionModalStatus) {
      case 'sort':
        return <SortMenu />
        break;
      case 'addCard':
        return <AddCardMenu />
        break;
      }
  }

  if (actionModalStatus.length > 0) {
    return (
      <div className={styles.container} onClick={closeModal}>
        <div className={styles.card} onClick={stopPropagation} onKeyDown={stopPropagation}>
          { renderModalContents() }
        </div>
      </div>
    )
  } else {
    return null;
  }
}
