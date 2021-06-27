import React, { useState, useEffect } from 'react';
import styles from './Footer.module.scss';
import classNames from 'classnames';

// Components

// Utility functions

export default function Footer({}) {
  return (
    <div className={styles.container}>
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
  )
}
