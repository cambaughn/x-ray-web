import React from 'react';
import App, { Container } from 'next/app';
// import Layout from '../components/Layout';
import './styles.css';

// This default export is required in a new `pages/_app.js` file.
export default function Xray({ Component, pageProps }) {
  return (
    <Component {...pageProps} />
  )
}
