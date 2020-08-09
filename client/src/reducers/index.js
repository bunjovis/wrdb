import { combineReducers } from 'redux';
import { settings } from './settings';
import { user } from './user';
import { message } from './message';

export default combineReducers({
  settings,
  user,
  message,
});
