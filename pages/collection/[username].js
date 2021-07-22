import Profile from '../../components/Profile/Profile';
import { useRouter } from 'next/router';

export default function ProfilePage() {
  const router = useRouter();
  const { username } = router.query;

  console.log('access collection page');

  return <Profile username={username} />
}
