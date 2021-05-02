import React, { useState, useEffect } from 'react';
import styles from './AddCardModal.module.scss';
import classNames from 'classnames';

/**
  This is a full screen modal that wraps around another component, providing a standard interface.
  It's a floating card with on a semi-transparent background that hovers over the rest of the page.
  @param {function} toggleModal - Gives the ability to toggle on/off
*/

export default function AddCardModal({ toggleModal, card }) {
  const [graded, setGraded] = useState(false);

  const stopClick = (event) => {
    event.stopPropagation();
  }

  return (
    <div className={styles.container} onClick={toggleModal}>
      <div className={styles.card} onClick={stopClick}>
        <h2 className={styles.title}>{card.name}</h2>

        <div className={styles.gradedButtons}>
          <div className={classNames({ [styles.gradedButton]: true, [styles.selectedButton]: graded === true })} onClick={() => setGraded(true)}>
            <span>Graded</span>
          </div>

          <div className={classNames({ [styles.gradedButton]: true, [styles.selectedButton]: graded === false })} onClick={() => setGraded(false)}>
            <span>Ungraded</span>
          </div>


        </div>
      </div>
    </div>
  );
}
