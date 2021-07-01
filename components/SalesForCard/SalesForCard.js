import React, { useState, useEffect } from 'react';
import styles from './SalesForCard.module.scss';
import classNames from 'classnames';

// Components

// Utility functions
import sale from '../../util/api/sales.js';
import { sortSalesByDate } from '../../util/helpers/sorting.js';


export default function SalesForCard({ card, selectedFinish, selectedGrade, selectedGradingAuthority}) {
  let [sales, setSales] = useState([]);
  let [numToShow, setNumToShow] = useState(5);

  const saleTypes = {
    'auction': 'Auction',
    'buy_now': 'Buy It Now'
  }

  const getSales = async () => {
    if (card.id) {
      let salesForCard = await sale.getForGrade(card, selectedGradingAuthority, selectedGrade);
      let salesByDate = sortSalesByDate(salesForCard).reverse();
      setSales(salesByDate);
      console.log('got sales for card ', salesForCard);
    }
  }

  useEffect(getSales, [card, selectedFinish, selectedGrade, selectedGradingAuthority]);

  return (
    <div className={styles.container}>
      { sales.length > 0 &&
        <>
          <h3>Recent Sales</h3>
          { sales.slice(0, numToShow).map(sale => {
            return (
              <div className={styles.saleRow} key={sale.id}>
                <div className={styles.listingImageWrapper}>
                  <img src={sale.listing_image} alt={'image from ebay listing'} className={styles.listingImage} />
                </div>
                <span className={classNames(styles.saleDetail, styles.price)}>${sale.price}</span>
                <span className={styles.saleDetail}>{saleTypes[sale.type]}</span>
                <span className={styles.saleDetail}>{sale.date_sold}</span>
              </div>
            )
          })}
        </>
      }
    </div>
  )
}
