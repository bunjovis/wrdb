export function fetchIngredients(token) {
  return (dispatch) => {
    return fetch('api/ingredienttypes', {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        dispatch(clearIngredients());
        dispatch(receiveIngredients(json.ingredientTypes));
      });
  };
}
export function fetchIngredient(token, id) {
  return (dispatch) => {
    return fetch('../api/ingredienttypes/' + id, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        dispatch(clearIngredient());
        dispatch(receiveIngredient(json.ingredientType));
      });
  };
}
function receiveIngredients(json) {
  return {
    type: 'RECEIVE_INGREDIENTS',
    json,
  };
}
function clearIngredients(json) {
  return {
    type: 'CLEAR_INGREDIENTS',
  };
}
function receiveIngredient(json) {
  return {
    type: 'RECEIVE_INGREDIENT',
    json,
  };
}
function clearIngredient(json) {
  return {
    type: 'CLEAR_INGREDIENT',
  };
}
