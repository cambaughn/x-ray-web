import React, { useEffect } from 'react';
import App, { Container } from 'next/app';
import { Provider } from 'react-redux';
import Stripe from 'stripe';
import store from '../redux/store';
import Head from '../components/Head/Head';
import InitState from '../components/InitState/InitState';
import MainLayout from '../components/Layouts/MainLayout/MainLayout';
import AuthCheck from '../components/Auth/AuthCheck';
import './styles.css';

// This default export is required in a new `pages/_app.js` file.
export default function Xray({ Component, pageProps }) {
  const checkForSSL = () => {
    // Check the URL starts with 'http://xxxxx' protocol, if it does then redirect to 'https://xxxxx' url of same resource
    let httpTokens = /^http:\/\/(.*)$/.exec(window.location.href);

    if (httpTokens && !httpTokens[0].includes('localhost')) {
      window.location.replace('https://' + httpTokens[1]);
    }
  }

  useEffect(checkForSSL);

  return (
    <Provider store={store}>
      <Head title="X-ray" />

      <MainLayout>
        <InitState />
        <AuthCheck>
            <Component {...pageProps} />
        </AuthCheck>
      </MainLayout>
    </Provider>
  )
}

export async function getServerSideProps(context) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  console.log('server side env variables ', process.env.STRIPE_SECRET_KEY);

  // const customer = await stripe.customers.retrieve(
  //   'cam.baughn@gmail.com'
  // );

  // console.log('customer ===> ', customer);

  return {
    props: { subscriptionActive: false }, // will be passed to the page component as props
  }
}
