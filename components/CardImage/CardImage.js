import React, { useState, useEffect } from 'react';
import styles from './CardImage.module.scss';
import classNames from 'classnames';

// Components

// Utility functions
import pokeCard from '../../util/api/card';
import { getCardInfo } from '../../util/pokemonAPI/pokemonAPI';

export default function CardImage({ card, selected, size = 'small' }) {
  let image_url = size === 'small' ? (card.images.small || card.images.large) : (card.images.large || card.images.small);

  return (
    <div className={styles.container}>
      <img
        src={image_url}
        className={classNames({[styles.thumbnail]: true, [styles.selectedCard]: selected })}
      />
    </div>
  )
}
