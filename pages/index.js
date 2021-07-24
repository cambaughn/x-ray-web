import { useSelector } from 'react-redux';
import Search from '../components/Search/Search';
import UserCollection from '../components/UserCollection/UserCollection';
import Home from '../components/Home/Home';
import Browse from '../components/Browse/Browse';


export default function Index({}) {
  const user = useSelector(state => state.user);
  const subscriptionStatus = useSelector(state => state.subscriptionStatus);

  return (
    <>
      { subscriptionStatus === 'active'
        ? <Browse />
        : <Home />
      }
    </>
  )
}
