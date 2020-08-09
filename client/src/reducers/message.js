export function message(state = null, action) {
  switch (action.type) {
    case 'SET_MESSAGE':
      return action.json.message;
    default:
      return state;
  }
}
