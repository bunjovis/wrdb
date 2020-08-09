export function user(
  state = { name: null, email: null, role: null, token: null },
  action
) {
  switch (action.type) {
    case 'LOGIN_SUCCESFUL':
      return {
        name: action.json.user.name,
        email: action.json.user.email,
        role: action.json.user.role,
        token: action.json.token,
      };
    case 'LOGOUT':
      return { name: null, email: null, role: null, token: null };
    default:
      return state;
  }
}
