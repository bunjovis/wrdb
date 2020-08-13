export function fetchWines(token) {
  return (dispatch) => {
    return fetch('api/wines', {
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
function clearWines(json) {
  return {
    type: 'CLEAR_WINES',
  };
}

function clearWine(json) {
  return {
    type: 'CLEAR_WINE',
  };
}
