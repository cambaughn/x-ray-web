import React from 'react';
import { useRouter } from 'next/router';
import Head from '../../components/Head/Head';

// Components
import CardDetails from '../../components/Card/CardDetails';


export default function CardPage({}) {
  const router = useRouter();
  const { card_id } = router.query;

  console.log('access card page');

  return (
    <CardDetails card_id={card_id} />
  )
}
