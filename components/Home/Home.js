import React from 'react';
import styles from './Home.module.scss';
import classNames from 'classnames';

// Components
import GetStartedButton from '../Buttons/GetStartedButton';

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


      {/* Product Features */}
      <div className={styles.textBlock}>
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
      </div>

      <div className={styles.socialBlock}>
        <h3 className={styles.socialText}>Join the conversation</h3>

        <div className={styles.socialLinks}>
          <a href={'https://discord.gg/Dfqemg8fAV'} target={'_blank'} className={styles.socialLink}>
            <img src={'/images/discord-logo-black.png'} alt={'discord icon'} className={styles.socialIcon} />
          </a>

          <a href={'https://twitter.com/xraydotfun'} target={'_blank'} className={styles.socialLink}>
            <img src={'/images/twitter-logo-black.png'} alt={'twitter icon'} className={classNames(styles.socialIcon, styles.twitterIcon)} />
          </a>
        </div>

      </div>
    </div>
  )
}
