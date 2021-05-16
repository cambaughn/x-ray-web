import React, { useState, useEffect } from 'react';
import styles from './HamburgerMenu.module.scss';
import { Menu, X } from 'react-feather';
import Link from 'next/link';
import classNames from 'classnames';

// Components

// Utility functions

export default function HamburgerMenu({}) {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  }

  return (
    <div className={styles.container}>
      <div className={styles.menuButton} onClick={toggleMenu}>
        <Menu className={styles.menuIcon} size={30} />
      </div>

      <div className={classNames({ [styles.backdrop]: true, [styles.backdropVisible]: showMenu })} onClick={toggleMenu}></div>

      <div className={classNames({ [styles.drawer]: true, [styles.drawerOpen]: showMenu })}>
        <div className={styles.closeButtonWrapper}>
          <div className={styles.closeButton} onClick={toggleMenu}>
            <X size={30} />
          </div>
        </div>

        <div className={styles.links}>
          <Link href={'/'}>
            <div className={styles.linkWrapper} onClick={toggleMenu}>
              <span className={styles.link}>Home</span>
            </div>
          </Link>
          <Link href={'/profile/settings'}>
            <div className={styles.linkWrapper} onClick={toggleMenu}>
              <span className={styles.link}>Settings</span>
            </div>
          </Link>
        </div>

      </div>

    </div>
  )
}
