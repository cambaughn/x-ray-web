import React, { useState, useEffect } from 'react';

// Components

// Utility functions

export default function KeyboardShortcuts({ children, sort }) {
  let shortcuts = {
    83: 'sort'
  }

  const handleKeyDown = (event) => {
    switch (shortcuts[event.keyCode]) {
      case 'sort':
        // Toggle the ActionModal in sorting mode
        // Only if "sort" shortcut is enabled for this page
        sort && console.log('sorting!');
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

  useEffect(setEventListeners, [])


  return <>
    { children }
  </>
}
