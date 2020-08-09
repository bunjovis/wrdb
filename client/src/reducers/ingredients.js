export function ingredients(state = { list: null, shown: null }, action) {
  switch (action.type) {
    case 'RECEIVE_INGREDIENT':
      return Object.assign({}, state, { shown: action.json });
    case 'RECEIVE_INGREDIENTS':
      return Object.assign({}, state, { list: action.json });
    case 'CLEAR_INGREDIENTS':
      return Object.assign({}, state, { list: null });
    case 'CLEAR_INGREDIENT':
      return Object.assign({}, state, { shown: null });
    default:
      return state;
  }
}
