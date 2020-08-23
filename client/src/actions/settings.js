export function fetchSettings(token) {
  return (dispatch) => {
    return fetch('../api/settings', {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        dispatch(receiveSettings(json.settings));
      });
  };
}
function receiveSettings(json) {
  return {
    type: 'SET_SETTINGS',
    json,
  };
}
export function saveSettings(token, settings) {
  return (dispatch) => {
    return fetch('../api/settings', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settings),
    })
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        dispatch(receiveSettings(json.settings));
      });
  };
}
