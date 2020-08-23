export function fetchWines(token) {
  return (dispatch) => {
    return fetch('../api/wines', {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        dispatch(clearWine());
        dispatch(clearWines());
        dispatch(receiveWines(json.wines));
      });
  };
}
function receiveWines(json) {
  return {
    type: 'RECEIVE_WINES',
    json,
  };
}
function clearWines() {
  return {
    type: 'CLEAR_WINES',
  };
}
export function fetchWine(token, id) {
  return (dispatch) => {
    return fetch('../../api/wines/' + id, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        dispatch(clearWine());
        dispatch(receiveWine(json.wine));
      });
  };
}
function receiveWine(json) {
  return {
    type: 'RECEIVE_WINE',
    json,
  };
}
function clearWine() {
  return {
    type: 'CLEAR_WINE',
  };
}
export function addWine(token, wine) {
  return (dispatch) => {
    return fetch('../api/wines', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify(wine),
    })
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        dispatch(clearWine());
        dispatch(receiveWine(json.wine));
      });
  };
}
export function editWine(token, id, wine) {
  return (dispatch) => {
    return fetch('../../api/wines/' + id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify(wine),
    })
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        console.log(json);
        dispatch(clearWine());
        dispatch(receiveWine(json.wine));
      });
  };
}
export function deleteWine(token, id) {
  return (dispatch) => {
    return fetch('../../api/wines/' + id, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    }).then((res) => {
      fetchWines(token);
    });
  };
}
