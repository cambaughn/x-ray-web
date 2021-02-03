import { createStore } from 'redux';
import { xRayApp } from './reducers';
import { wrapStore } from 'webext-redux';

const store = createStore(xRayApp);

wrapStore(store);

export default store;
