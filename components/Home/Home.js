import React from 'react';
import styles from './Home.module.scss';
import classNames from 'classnames';

// Components
import GetStartedButton from '../Buttons/GetStartedButton';
import Footer from '../Footer/Footer';

// Utility functions

export default function Home({}) {
  return (
    <div className={styles.container}>
      {/* Product Overview */}
      <div className={styles.textBlock}>
        <h1 className={styles.header}>Power up your collection</h1>
        <p className={styles.bodyText}>Pokémon collectors: <span className={styles.callout}>Track the value of your cards with X-ray.</span></p>
      </div>

      <div className={styles.getStartedWrapper}>
        <GetStartedButton />
        {/* <span className={styles.priceText}>2 week free trial, then $7 per month</span> */}
      </div>

      {/* Product image */}
      <div className={styles.featureBlock}>
        <img src={'/images/charizard-card-detail.png'} alt={'charizard card image, details, and charts of pricing over time'} className={classNames(styles.productImage, styles.marginRight)} />
        <div className={styles.featureText}>
          <span className={styles.featureHeader}>Dig into the details</span>
          <span className={styles.featureBody}>Track real-world trends on the cards you care about.</span>
          <span className={styles.featureBody}>Compare graded vs. ungraded sales over time.</span>
          <span className={styles.featureBody}>View contextual data like number of sales, total volume, and highest and lowest prices.</span>
        </div>
      </div>

      <div className={styles.featureBlock}>
        <div className={styles.featureText}>
          <span className={styles.featureHeader}>Manage your collection</span>
          <span className={styles.featureBody}>Add cards and track the entire value of your collection over time.</span>
          <span className={styles.featureBody}>Keep an eye on price changes for individual cards at a glance.</span>
        </div>

        <img src={'/images/collection-example.png'} alt={'collection page, including a chart of prices over time and many cards'} className={classNames(styles.productImage, styles.marginLeft)} />
      </div>


      {/* Product Features */}
      {/* <div className={styles.textBlock}>
        <div className={styles.featureSection}>
          <img src={'/images/stocks.png'} alt={'stocks icon'} className={styles.featureIcon} />
          <p className={`${styles.bodyText} ${styles.featuresText}`}>Track sales trends on the cards you care about.</p>
        </div>

        <div className={styles.featureSection}>
          <img src={'/images/smart.png'} alt={'brain icon'} className={styles.featureIcon} />
          <p className={`${styles.bodyText} ${styles.featuresText}`}>Make smart buying and selling decisions with constantly-updated data from major e-commerce platforms.</p>
        </div>
        <div className={styles.featureSection}>
          <img src={'/images/details.png'} alt={'shovel icon'} className={styles.featureIcon} />
          <p className={`${styles.bodyText} ${styles.featuresText}`}>Dig into the specifics with details on grading, volume, and changes over time.</p>
        </div>
      </div> */}

      <Footer />
    </div>
  )
}
