import Link from 'next/link';
import { Provider } from 'react-redux';
import store from '../redux/store';
import Head from '../components/Head/Head';
import SearchContainer from '../components/Search/SearchContainer';
import MainLayout from '../components/MainLayout/MainLayout';

export default () => (
  <Provider store={store}>
    <MainLayout>
      <Head title="X-ray" />
      <SearchContainer />
    </MainLayout>
  </Provider>
);
