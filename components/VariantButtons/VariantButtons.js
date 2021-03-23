import React from 'react';
import styles from './VariantButtons.module.scss';
import classNames from 'classnames';

// Components

// Utility functions

const variantMap = {
  'non-holo': 'Non-holo',
  'reverse_holo': 'Reverse holo',
  'holo': 'Holo'
}
export default function VariantButtons({ variants, selectedVariant, setSelectedVariant }) {
  return (
    <div className={styles.container}>
      { variants.map(variant => {
        return (
          <div onClick={() => setSelectedVariant(variant)} className={classNames({ [styles.button]: true, [styles.selectedButton]: selectedVariant === variant })} key={variant}>
            <span>{variantMap[variant]}</span>
          </div>
        )
      })}
    </div>
  )
}
