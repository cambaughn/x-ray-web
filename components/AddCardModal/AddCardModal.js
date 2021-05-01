import React from 'react';
import styles from './AddCardModal.module.scss';

/**
  This is a full screen modal that wraps around another component, providing a standard interface.
  It's a floating card with on a semi-transparent background that hovers over the rest of the page.
  @param {function} toggleModal - Gives the ability to toggle on/off
*/

export default function AddCardModal({ toggleModal, children }) {

  const stopClick = (event) => {
    event.stopPropagation();
  }

  return (
    <div className={styles.container} onClick={toggleModal}>
      <div className={styles.card} onClick={stopClick}>
        { children }
      </div>
    </div>
  );
}
