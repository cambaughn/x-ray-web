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
  const [loading, setLoading] = useState({});

  const getSales = async () => {
    setLoading(true);
    let salesData = await sale.getPending();
    salesData = sortSalesByPrice(salesData, 'ascending');

    console.log('got sales ', salesData);

    setLoading(false);
    setPendingSales(salesData);

    if (salesData[0] && salesData[0].card_id && salesData[0].card_id !== card.id) {
      let cardData = await pokeCard.get(salesData[0].card_id);
      setCard(cardData);
    }
  }

  const rejectSale = async (sale_id) => {
    await sale.reject(sale_id);
    let salesData = pendingSales.filter(sale => sale.id !== sale_id);
    setPendingSales(salesData);
  }

  const approveAll = async () => {
    let updateRefs = pendingSales.map(listing => {
      let updates = {
        price: listing.price || null,
        grading_authority: listing.grading_authority || null,
        grade: listing.grade || null
      }

      return sale.approve(listing.id, updates);
    });
    await Promise.all(updateRefs);
    console.log('approved all sales on page');
    setPendingSales([]);
    getSales();
    window.scrollTo(0, 0);
  }

  const updatePrice = (price, index) => {
    let updatedSales = [ ...pendingSales ];
    updatedSales[index].price = price;
    setPendingSales(updatedSales);
  }

  const updateGrade = (key, value, index) => {
    let updatedSales = [ ...pendingSales ];
    updatedSales[index][key] = value;
    console.log('updating grade ', updatedSales[index]);
    setPendingSales(updatedSales);
  }


  useEffect(getSales, []);

  return (
    <div className={styles.container}>
      { card.name &&
        <div className={styles.cardDetails}>
          <div className={styles.imageWrapper}>
            { card.images && card.images.small &&
              <img src={card.images.small} className={styles.image} />
            }
          </div>

          <h3 className={styles.cardName}>{card.name}</h3>

          <div className={styles.tags}>
            <Tag text={`${card.number}`} color={'#3498db'} />
            <Tag text={card.rarity} color={'#EE5253'} />
            <Tag text={card.set_name} color={'#5F27CD'} />
          </div>

          <div className={styles.approveAllButton} onClick={approveAll}>
            <span>Approve all</span>
          </div>
        </div>
      }

      <div className={styles.salesList}>
        { !loading && pendingSales.length === 0 &&
          <h3>No listings available</h3>
        }

        { pendingSales.map((sale, index) => {
          return (
            <div className={styles.saleWrapper} key={sale.id}>
              <div className={styles.listingImageWrapper}>
                { sale.listing_image &&
                  <img src={sale.listing_image} className={styles.listingImage} />
                }
              </div>

              <div className={styles.textDetails}>
                <h3 className={styles.listingTitle}>{sale.title}</h3>
                <div className={styles.listingDetail}>
                  <div className={styles.priceWrapper}>
                    <h2 className={styles.price}>$</h2>
                    <input
                      type='text'
                      value={sale.price}
                      className={styles.priceInput}
                      onChange={event => updatePrice(event.target.value, index)}
                      placeholder='N/A'
                    />
                  </div>
                    <div className={styles.gradeWrapper}>
                      <input
                        type='text'
                        value={sale.grading_authority}
                        className={styles.gradeInput}
                        onChange={event => updateGrade('grading_authority', event.target.value, index)}
                        placeholder='Grader...'
                      />
                      <input
                        type='text'
                        value={sale.grade}
                        className={styles.gradeInput}
                        onChange={event => updateGrade('grade', event.target.value, index)}
                        placeholder='1-10...'
                      />
                    </div>
                </div>

                <div className={styles.actions}>
                  <a href={sale.url} className={styles.listingLink} target="_blank">View listing on eBay</a>
                  { card.name &&
                    <div className={styles.rejectButton} onClick={() => rejectSale(sale.id)}>
                      <span>Reject listing</span>
                    </div>
                  }
                </div>
              </div>

            </div>
          )
        })}
      </div>

    </div>
  )
}
