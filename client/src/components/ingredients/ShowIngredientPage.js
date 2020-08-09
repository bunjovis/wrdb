import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import { fetchIngredient } from '../../actions/ingredients';
import translations from '../../misc/translations.json';

function ShowIngredientPage(props) {
  const labels = translations[props.settings.language];
  useEffect(() => {
    props.fetchIngredient(props.user.token, props.match.params.id);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  if (props.ingredient == null) {
    return (
      <Box>
        <Typography variant="h2">{labels['LABEL_INGREDIENT_SHOW']}</Typography>
        <Alert severity="info">
          <AlertTitle>{labels['LABEL_INFO']}</AlertTitle>
          {labels['LABEL_INGREDIENT_EMPTY']}
        </Alert>
      </Box>
    );
  } else {
    return (
      <Box>
        <Typography variant="h2">
          {labels['LABEL_INGREDIENT_SHOW']} {props.ingredient.name}
        </Typography>
        {labels['LABEL_INGREDIENTS_UNIT']}: {props.ingredient.unit}
        <br />
        {labels['LABEL_INGREDIENTS_PRICE']}: {props.ingredient.price}
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
});
export default connect(mapStateToProps, mapDispatchToProps)(ShowIngredientPage);
