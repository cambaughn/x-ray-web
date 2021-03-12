import Link from 'next/link';
import SearchContainer from '../components/Search/SearchContainer';
import MainLayout from '../components/Layouts/MainLayout/MainLayout';
import SignIn from '../components/SignIn/SignIn';

export default function SignInPage() {
  return (
    <MainLayout>
      <SignIn />
    </MainLayout>
  )
}
