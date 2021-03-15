import React from 'react';
import App, { Container } from 'next/app';
import { Provider } from 'react-redux';
import store from '../redux/store';
import Head from '../components/Head/Head';
import MainLayout from '../components/Layouts/MainLayout/MainLayout';
import AuthCheck from '../components/Auth/AuthCheck';
import './styles.css';

// This default export is required in a new `pages/_app.js` file.
export default function Xray({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Head title="X-ray" />

      <MainLayout>
        <AuthCheck>
            <Component {...pageProps} />
        </AuthCheck>
      </MainLayout>
    </Provider>
  )
}
