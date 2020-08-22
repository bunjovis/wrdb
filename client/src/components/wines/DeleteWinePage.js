import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import { fetchWine, deleteWine } from '../../actions/wines';
import translations from '../../misc/translations.json';
import FormGroup from '@material-ui/core/FormGroup';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';

function DeleteWinePage(props) {
  const labels = translations[props.settings.language];
  const [redirect, setRedirect] = useState(null);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (added) {
      setAdded(false);
      setRedirect('/wines');
    }
  }, [added, props]);

  useEffect(() => {
    props.fetchWine(props.user.token, props.match.params.id);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  if (redirect != null) {
    return <Redirect to={redirect} />;
  }
  function handleDelete() {
    props.deleteWine(props.user.token, props.match.params.id);
    setRedirect('/wines');
  }
  if (props.wine) {
    return (
      <Box>
        <Typography variant="h2">
          {labels['LABEL_WINES_DELETE']} {props.wine.name}?
        </Typography>
        <Button onClick={handleDelete}>{labels['LABEL_YES']}</Button>
        <Button onClick={() => setRedirect('/wines')}>
          {labels['LABEL_NO']}
        </Button>
      </Box>
    );
  } else {
    return (
      <Box>
        <Alert severity="info">
          <AlertTitle>{labels['LABEL_INFO']}</AlertTitle>
          {labels['LABEL_WINE_EMPTY']}
        </Alert>
      </Box>
    );
  }
}
const mapStateToProps = (state) => ({
  wine: state.wines.shown,
  user: state.user,
  settings: state.settings,
});
const mapDispatchToProps = (dispatch) => ({
  fetchWine: (token, id) => dispatch(fetchWine(token, id)),
  deleteWine: (token, id) => dispatch(deleteWine(token, id)),
});
export default connect(mapStateToProps, mapDispatchToProps)(DeleteWinePage);
