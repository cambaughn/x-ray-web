import React, { useState, useEffect } from 'react';
import styles from './Profile.module.scss';

// Components
import UserCollection from '../UserCollection/UserCollection';

// Utility functions

export default function Profile({ username }) {
  return (
    <UserCollection username={username} />
  )
}
