export function settings(state = { darkMode: true, language: 'en' }, action) {
  switch (action.type) {
    case 'TOGGLE_DARK_MODE':
      return Object.assign({}, state, {
        darkMode: action.darkMode,
      });
    default:
      return state;
  }
}
