import { combineReducers } from 'redux';
import UserReducer from './UserReducer';

const appReducer = combineReducers({
  users: UserReducer,
});

const rootReducer = (state, action) => {
  if (action.type === 'USER_LOGOUT') {
    state = undefined;
  }

  return appReducer(state, action);
};

export default rootReducer;
