import { useSelector } from 'react-redux'
import Search from '../components/Search/Search';
import MainLayout from '../components/Layouts/MainLayout/MainLayout';
import Home from '../components/Home/Home';

export default function Index({}) {
  const user = useSelector(state => state.user);

  return (
    <MainLayout>
      { !!user.email
        ? <Search />
        : <Home />
      }
    </MainLayout>
  )
}
