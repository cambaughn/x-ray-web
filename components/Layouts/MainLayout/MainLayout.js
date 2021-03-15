import React from 'react';

// Components
import NavBarContainer from '../../NavBar/NavBarContainer';

// Utility functions

export default function MainLayout({ children }) {
  return (
    <div>
      <NavBarContainer />
      { children }
    </div>
  )
}
