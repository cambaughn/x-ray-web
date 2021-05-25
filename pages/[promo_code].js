import React from 'react';
import { useRouter } from 'next/router';
import Head from '../components/Head/Head';

// Components
import SignIn from '../components/SignIn/SignIn';

export default function PromoPage({}) {
  const router = useRouter();
  const { promo_code } = router.query;

  console.log('promo code ', promo_code);

  return (
    <SignIn promo_code={promo_code} />
  )
}
