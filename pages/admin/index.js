import React from 'react';
import { useRouter } from 'next/router';

// Components
import AdminContainer from '../../components/Admin/AdminContainer';


export default function AdminHome({}) {
  const router = useRouter();
  const { card_id } = router.query;

  return (
    <AdminContainer />
  )
}
