export function settings(state = { darkMode: true, language: 'en' }, action) {
  switch (action.type) {
    case 'SET_SETTINGS':
      return action.json;
    default:
      return state;
  }
}
