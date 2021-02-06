import React from 'react';
import { useRouter } from 'next/router';

// Components
import CardDetails from '../../components/Card/CardDetails';


export default function CardPage({}) {
  const router = useRouter();
  const { card_id } = router.query;

  return (
    <CardDetails card_id={card_id} />
  )
}
