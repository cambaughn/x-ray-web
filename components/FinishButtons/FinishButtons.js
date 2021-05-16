import React from 'react';
import styles from './FinishButtons.module.scss';
import classNames from 'classnames';

// Components

// Utility functions

const finishMap = {
  'non-holo': 'Non-holo',
  'reverse_holo': 'Reverse holo',
  'holo': 'Holo'
}

export default function FinishButtons({ finishes, selectedFinish, setSelectedFinish }) {
  return (
    <div className={styles.container}>
      { finishes.map(finish => {
        return (
          <div onClick={() => setSelectedFinish(finish)} className={classNames({ [styles.button]: true, [styles.selectedButton]: selectedFinish === finish })} key={finish}>
            <span>{finishMap[finish]}</span>
          </div>
        )
      })}
    </div>
  )
}
