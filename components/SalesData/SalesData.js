import React, { useState, useEffect } from 'react';
import styles from './SalesData.module.scss';

// Components
import Tag from '../Tag/Tag';

// Utility functions
import sale from '../../util/api/sales';
import pokeCard from '../../util/api/card';
import { sortSalesByPrice } from '../../util/sorting';
import { getImageForListings } from '../../util/eBay/eBayHelpers';

export default function SalesData({}) {
  const [pendingSales, setPendingSales] = useState([]);
  // const [rejectedSales, setRejectedSales] = useState([]);
  const [card, setCard] = useState({});
  const [listingImages, setListingImages] = useState({});

  const getSales = async () => {
    let salesData = await sale.getForCard('swsh4-188');
    salesData = sortSalesByPrice(salesData, 'ascending');
    setPendingSales(salesData);

    if (salesData[0].card_id && salesData[0].card_id !== card.id) {
      let cardData = await pokeCard.get(salesData[0].card_id);
      setCard(cardData);
    }

    console.log('got sales ', salesData);
  }

  const rejectSale = async (sale_id) => {
    await sale.reject(sale_id);
    let salesData = pendingSales.filter(sale => sale.id !== sale_id);
    setPendingSales(salesData);
  }


  useEffect(getSales, []);

  return (
    <div className={styles.container}>
      { card.id &&
        <div className={styles.leftColumn}>
          <div className={styles.cardDetails}>
            <div className={styles.imageWrapper}>
              { card.images && card.images.small &&
                <img src={card.images.small} className={styles.image} />
              }
            </div>

            <h3 className={styles.cardName}>{card.name}</h3>

            <div className={styles.tags}>
              <Tag text={`${card.number}`} color={'#2ecc71'} />
              <Tag text={card.rarity} color={'#EE5253'} />
              <Tag text={card.set_name} color={'#5F27CD'} />
            </div>
          </div>
        </div>
      }

      <div className={styles.salesList}>
        { pendingSales.map((sale, index) => {
          return (
            <div className={styles.saleWrapper} key={sale.id}>
              <h3>{sale.title}</h3>
              <div className={styles.listingDetail}>
                <h2 className={styles.price}>${sale.price}</h2>
                { sale.grade &&
                  <h2>&nbsp;- {sale.grading_authority} {sale.grade}</h2>
                }
              </div>

              <div className={styles.actions}>
                <a href={sale.url} className={styles.listingLink} target="_blank">View listing on eBay</a>
                <div className={styles.rejectButton} onClick={() => rejectSale(sale.id)}>
                  <span>Reject listing</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

    </div>
  )
}
