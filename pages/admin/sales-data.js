import React from 'react';
import { useRouter } from 'next/router';

// Components
import MainLayout from '../../components/Layouts/MainLayout/MainLayout';
import AdminLayout from '../../components/Layouts/AdminLayout/AdminLayout';
import SalesData from '../../components/SalesData/SalesData';


export default function AdminHome({}) {
  const router = useRouter();
  const { card } = router.query;

  return (
    <MainLayout>
      <AdminLayout>
        <SalesData />
      </AdminLayout>
    </MainLayout>
  )
}
