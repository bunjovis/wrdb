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
        dispatch(clearIngredient());
        dispatch(clearIngredients());
        dispatch(receiveIngredients(json.ingredientTypes));
      });
  };
}
export function fetchIngredients2(token) {
  return (dispatch) => {
    return fetch('../api/ingredienttypes', {
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
        dispatch(clearIngredients());
        dispatch(receiveIngredients(json.ingredientTypes));
      });
  };
}
export function fetchIngredients3(token) {
  return (dispatch) => {
    return fetch('../../api/ingredienttypes', {
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
        dispatch(clearIngredients());
        dispatch(receiveIngredients(json.ingredientTypes));
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
export function fetchIngredient(token, id) {
  return (dispatch) => {
    return fetch('../../api/ingredienttypes/' + id, {
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
export function addIngredient(token, ingredient) {
  return (dispatch) => {
    return fetch('../api/ingredienttypes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify({
        name: ingredient.name,
        unit: ingredient.unit,
        price: ingredient.price,
      }),
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
export function editIngredient(token, id, ingredient) {
  return (dispatch) => {
    return fetch('../../api/ingredienttypes/' + id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify({
        name: ingredient.name,
        unit: ingredient.unit,
        price: ingredient.price,
      }),
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
export function deleteIngredient(token, id) {
  return (dispatch) => {
    return fetch('../../api/ingredienttypes' + id, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((json) => {});
  };
}
