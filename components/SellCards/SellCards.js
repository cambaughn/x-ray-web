import React, { useState, useEffect } from 'react';
import styles from './SellCards.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import classNames from 'classnames';

// Components

// Utility functions
import offer from '../../util/api/offer';


export default function SellCards({}) {
  const user = useSelector(state => state.user);
  const collectionDetails = useSelector(state => state.collectionDetails); // array of card ids
  const collectedItems = useSelector(state => state.collectedItems); // object with card objects mapped to ids
  const [selected, setSelected] = useState(new Set());
  const [page, setPage] = useState('select'); // select, confirm
  const [userOffer, setUserOffer] = useState({}); // select, confirm

  const toggleSelect = (detail_id) => {
    let newSelected = new Set(selected);
    if (newSelected.has(detail_id)) {
      newSelected.delete(detail_id);
    } else {
      newSelected.add(detail_id);
    }

    setSelected(newSelected);
  }

  const handleContinueButtonClick = () => {
    if (page === 'select') {
      setPage('confirm');
    } else {
      submitOffer();
    }
  }

  const submitOffer = async () => {

  }

  const getExistingOffers = async () => {
    let existing = await offer.get(user.id);
    if (!existing) {
      await offer.create(user.id);
      existing = offer.get(user.id);
    }

    console.log('existing ', existing);
    setUserOffer(existing);
  }

  useEffect(getExistingOffers, []);

  return (
    <div className={styles.container}>
      <div className={styles.headerTop}>
        <h3 className={styles.header}>Sell your cards</h3>
        <div className={styles.buttons}>
          { page === 'confirm' &&
            <div className={styles.previousButton} onClick={() => setPage('select')}>
              <span>Previous</span>
            </div>
          }

          <div className={classNames(styles.continueButton, { [styles.continueAvailable]: selected.size > 0 })} onClick={handleContinueButtonClick}>
            <span>{page === 'select' ? 'Continue' : 'Submit'}</span>
          </div>

        </div>
      </div>


      { collectionDetails.map((detail, index) => {
        let item = collectedItems[detail.item_id] || {};
        let image_src = null;
        if (item && item.images) {
          image_src = item.images.small || item.images.large;
        }

        return (
          <div className={classNames(styles.itemRow, { [styles.selectedRow]: selected.has(detail.id) })} onClick={() => toggleSelect(detail.id)} key={index}>
            <img src={image_src} className={styles.cardImage} />
            <span className={classNames(styles.detailCell, styles.itemName)}>{item.name}</span>
            <span className={classNames(styles.detailCell, styles.grade)}>{detail.grading_authority && detail.grade ? `${detail.grading_authority} ${detail.grade}` : 'Ungraded'}</span>
            <span className={classNames(styles.detailCell, styles.setName)}>{item.set_name}</span>
            <span className={classNames(styles.detailCell, styles.number)}>#{item.number}</span>

            <span className={classNames(styles.detailCell, styles.language)}>{item.language === 'en' ? 'English' : 'Japanese'}</span>
          </div>
        )
      })}
    </div>
  )
}
