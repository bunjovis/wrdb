export function wines(state = { list: null, shown: null }, action) {
  switch (action.type) {
    case 'RECEIVE_WINE':
      return Object.assign({}, state, { shown: action.json });
    case 'RECEIVE_WINES':
      return Object.assign({}, state, { list: action.json });
    case 'CLEAR_WINES':
      return Object.assign({}, state, { list: null });
    case 'CLEAR_WINE':
      return Object.assign({}, state, { shown: null });
    default:
      return state;
  }
}
