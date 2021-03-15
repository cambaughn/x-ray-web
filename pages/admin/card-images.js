import React from 'react';
import { useRouter } from 'next/router';

// Components
import AdminLayout from '../../components/Layouts/AdminLayout/AdminLayout';
import CardImage from '../../components/CardImage/CardImage';


export default function CardImagePage({}) {
  const router = useRouter();
  const { card } = router.query;

  return (
    <AdminLayout>
      <CardImage />
    </AdminLayout>
  )
}
