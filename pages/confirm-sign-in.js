import Link from 'next/link';
import SearchContainer from '../components/Search/SearchContainer';
import MainLayout from '../components/Layouts/MainLayout/MainLayout';
import ConfirmSignInContainer from '../components/ConfirmSignIn/ConfirmSignInContainer';

export default function ConfirmSignInPage() {
  return (
    <MainLayout>
      <ConfirmSignInContainer />
    </MainLayout>
  )
}
