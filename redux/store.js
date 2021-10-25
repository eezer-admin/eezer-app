import Reducers from './Reducers';

const { createStore } = require('redux');

const store = createStore(Reducers);

export default store;
