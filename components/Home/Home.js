import React from 'react';
import styles from './Home.module.scss';

// Components

// Utility functions

export default function Home({}) {
  return (
    <div className={styles.container}>
      {/* Product Overview */}
      <div className={styles.textBlock}>
        <h1 className={styles.header}>X-ray vision</h1>
        <p className={styles.bodyText}>Calling all Pokémon collectors!</p>
        <p className={styles.bodyText}>X-ray gives you deep insights into current trends and sales history across platforms, enabling you to make smart decisions when selling or buying new cards.</p>
      </div>

      {/* Product Features */}
      <div className={styles.textBlock}>
        <div className={styles.featureSection}>
          <img src={'/images/stocks.png'} alt={'stocks icon'} className={styles.featureIcon} />
          <p className={`${styles.bodyText} ${styles.featuresText}`}>See specifics on individual sales across time and track overall trends on the items you care about.</p>
        </div>
        <div className={styles.featureSection}>
          <img src={'/images/smart.png'} alt={'brain icon'} className={styles.featureIcon} />
          <p className={`${styles.bodyText} ${styles.featuresText}`}>Get the info you need to make smart decisions with constantly-updated data from the major e-commerce platforms.</p>
        </div>
        <div className={styles.featureSection}>
          <img src={'/images/details.png'} alt={'shovel icon'} className={styles.featureIcon} />
          <p className={`${styles.bodyText} ${styles.featuresText}`}>Dig into the specifics with detailed breakdowns by platform, item quality and condition, and grading status.</p>
        </div>
      </div>
    </div>
  )
}
