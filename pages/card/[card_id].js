import React from 'react';
import { useRouter } from 'next/router';
import Head from '../../components/Head/Head';

// Components
import CardDetails from '../../components/Card/CardDetails';
import MainLayout from '../../components/Layouts/MainLayout/MainLayout';


export default function CardPage({}) {
  const router = useRouter();
  const { card_id } = router.query;

  return (
    <MainLayout>
      <CardDetails card_id={card_id} />
    </MainLayout>
  )
}
