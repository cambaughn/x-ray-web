import Link from 'next/link';
import { Provider } from 'react-redux';
import store from '../redux/store';
import Head from '../components/Head/Head';
import SearchContainer from '../components/Search/SearchContainer';

export default () => (
  <Provider store={store}>
    <Head title="X-ray" />
    <SearchContainer />
  </Provider>
);
