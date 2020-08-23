export function userLogin(email, password) {
  return (dispatch) => {
    return fetch('api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        console.log(json);
        if (json.token) {
          dispatch(clearMessage());
          dispatch(succesfulLogin(json));
        } else {
          dispatch(unsuccesfulLogin(json));
        }
      });
  };
}
function succesfulLogin(json) {
  return {
    type: 'LOGIN_SUCCESFUL',
    json,
  };
}
function unsuccesfulLogin(json) {
  return {
    type: 'SET_MESSAGE',
    json,
  };
}
function clearMessage() {
  return {
    type: 'SET_MESSAGE',
    json: { message: '' },
  };
}
export function userLogout() {
  return (dispatch) => {
    dispatch(logout());
  };
}
function logout() {
  return {
    type: 'LOGOUT',
  };
}
