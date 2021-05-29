import Profile from '../../components/Profile/Profile';
import { useRouter } from 'next/router';

export default function UserProfilePage() {
  const router = useRouter();
  const { username } = router.query;

  return <Profile username={username} />
}
