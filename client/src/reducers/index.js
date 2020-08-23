import { combineReducers } from 'redux';
import { settings } from './settings';
import { user } from './user';
import { message } from './message';
import { ingredients } from './ingredients';
import { wines } from './wines';

export default combineReducers({
  settings,
  user,
  message,
  ingredients,
  wines,
});
