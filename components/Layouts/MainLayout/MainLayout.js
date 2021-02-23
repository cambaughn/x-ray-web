import React from 'react';

// Components
import NavBar from '../../NavBar/NavBar';

// Utility functions

export default function MainLayout({ children }) {
  return (
    <div>
      <NavBar />
      {children}
    </div>
  )
}
