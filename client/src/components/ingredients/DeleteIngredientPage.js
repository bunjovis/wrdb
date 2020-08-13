import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import { fetchIngredient, deleteIngredient } from '../../actions/ingredients';
import translations from '../../misc/translations.json';
import FormGroup from '@material-ui/core/FormGroup';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';

function DeleteIngredientPage(props) {
  const labels = translations[props.settings.language];
  const [redirect, setRedirect] = useState(null);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (added) {
      setAdded(false);
      setRedirect('/ingredients');
    }
  }, [added, props]);

  useEffect(() => {
    props.fetchIngredient(props.user.token, props.match.params.id);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  if (redirect != null) {
    return <Redirect to={redirect} />;
  }
  if (props.ingredient) {
    return (
      <Box>
        <Typography variant="h2">
          {labels['LABEL_INGREDIENTS_DELETE']} {props.ingredient.name}?
        </Typography>
      </Box>
    );
  } else {
    return (
      <Box>
        <Typography variant="h2">{labels['LABEL_INGREDIENT_SHOW']}</Typography>
        <Alert severity="info">
          <AlertTitle>{labels['LABEL_INFO']}</AlertTitle>
          {labels['LABEL_INGREDIENT_EMPTY']}
        </Alert>
      </Box>
    );
  }
}
const mapStateToProps = (state) => ({
  ingredient: state.ingredients.shown,
  user: state.user,
  settings: state.settings,
});
const mapDispatchToProps = (dispatch) => ({
  fetchIngredient: (token, id) => dispatch(fetchIngredient(token, id)),
  deleteIngredient: (token, id) => dispatch(deleteIngredient(token, id)),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DeleteIngredientPage);
