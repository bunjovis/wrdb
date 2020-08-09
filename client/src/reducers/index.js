import { combineReducers } from 'redux';
import { settings } from './settings';
import { user } from './user';
import { message } from './message';
import { ingredients } from './ingredients';

export default combineReducers({
  settings,
  user,
  message,
  ingredients,
});
