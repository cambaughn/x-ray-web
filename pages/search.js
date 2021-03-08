import Link from 'next/link';
import SearchContainer from '../components/Search/SearchContainer';
import MainLayout from '../components/Layouts/MainLayout/MainLayout';
import Search from '../components/Search/Search';

export default function SearchPage() {
  return (
    <MainLayout>
      <Search />
    </MainLayout>
  )
}
