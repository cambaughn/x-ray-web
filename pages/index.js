import { useSelector } from 'react-redux';
import Search from '../components/Search/Search';
import Home from '../components/Home/Home';

export default function Index({}) {
  const user = useSelector(state => state.user);
  const subscriptionLevel = useSelector(state => state.subscriptionLevel);

  return (
    <>
      { !!user.email && !!user.username
        ? <Search />
        : <Home />
      }
    </>
  )
}
