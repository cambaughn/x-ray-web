import { useSelector } from 'react-redux';
import Search from '../components/Search/Search';
import UserCollection from '../components/UserCollection/UserCollection';
import Home from '../components/Home/Home';
import Browse from '../components/Browse/Browse';


export default function Index({}) {
  const user = useSelector(state => state.user);
  const subscriptionLevel = useSelector(state => state.subscriptionLevel);
  const isBetaUser = useSelector(state => state.isBetaUser);

  console.log('access index page');

  return (
    <>
      { !!user.email && !!user.username
        ? <Browse />
        : <Home />
      }
    </>
  )
}
