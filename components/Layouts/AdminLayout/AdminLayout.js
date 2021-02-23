import React from 'react';

// Components
import AdminNav from '../../AdminNav/AdminNav';

// Utility functions

export default function AdminLayout({ children }) {
  return (
    <div>
      <AdminNav />
      {children}
    </div>
  )
}
