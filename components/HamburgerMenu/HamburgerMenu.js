import React, { useState, useEffect } from 'react';
import styles from './HamburgerMenu.module.scss';
import { Menu } from 'react-feather';
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

      </div>

    </div>
  )
}
