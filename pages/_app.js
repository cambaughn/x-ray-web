import React from 'react';
import App, { Container } from 'next/app';
import { Provider } from 'react-redux';
import Stripe from 'stripe';
import store from '../redux/store';
import Head from '../components/Head/Head';
import MainLayout from '../components/Layouts/MainLayout/MainLayout';
import AuthCheck from '../components/Auth/AuthCheck';
import './styles.css';
import 'regenerator-runtime';

// This default export is required in a new `pages/_app.js` file.
export default function Xray({ Component, pageProps }) {

  return (
    <Provider store={store}>
      <Head title="X-ray" />

      <MainLayout>
        <AuthCheck subscriptionActive={pageProps.subscriptionActive}>
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
