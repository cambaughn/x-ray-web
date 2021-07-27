import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// Components

// Utility functions
import { setActionModalStatus } from '../../redux/actionCreators';


export default function KeyboardShortcuts({ children, sort }) {
  const dispatch = useDispatch();

  let shortcuts = {
    83: 'sort'
  }

  const handleKeyDown = (event) => {
    switch (shortcuts[event.keyCode]) {
      case 'sort':
        // Toggle the ActionModal in sorting mode
        // Only if "sort" shortcut is enabled for this page
        sort && dispatch(setActionModalStatus('sort'));
        break;
      }
  }

  const handleKeyUp = (event) => {

  }

  const setEventListeners = () => {
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    }
  }

  useEffect(setEventListeners, [sort])


  return <>
    { children }
  </>
}
