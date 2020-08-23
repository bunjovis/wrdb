import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { fetchIngredient, editIngredient } from '../../actions/ingredients';
import translations from '../../misc/translations.json';
import FormGroup from '@material-ui/core/FormGroup';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

function EditIngredientPage(props) {
  const labels = translations[props.settings.language];
  const [name, setName] = useState('');
  const [unit, setUnit] = useState('');
  const [price, setPrice] = useState(0.01);
  const [redirect, setRedirect] = useState(null);
  const [added, setAdded] = useState(false);
  const handleSubmit = (event) => {
    event.preventDefault();
    if (event.target.checkValidity()) {
      props.editIngredient(props.user.token, props.match.params.id, {
        name: name,
        unit: unit,
        price: price,
      });
      setAdded(true);
    }
  };
  const handleChangeName = (event) => {
    setName(event.target.value);
  };
  const handleChangeUnit = (event) => {
    setUnit(event.target.value);
  };
  const handleChangePrice = (event) => {
    setPrice(event.target.value);
  };
  useEffect(() => {
    if (props.ingredient && added) {
      setAdded(false);
      setRedirect('/ingredients/' + props.ingredient._id + '/show');
    }
  }, [added, props]);
  useEffect(() => {
    if (props.ingredient) {
      setName(props.ingredient.name);
      setUnit(props.ingredient.unit);
      setPrice(props.ingredient.price);
    }
  }, [props.ingredient]);
  useEffect(() => {
    props.fetchIngredient(props.user.token, props.match.params.id);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  if (redirect != null) {
    return <Redirect to={redirect} />;
  }
  return (
    <Box>
      <Typography variant="h2">{labels['LINK_INGREDIENTS_EDIT']}</Typography>
      <form onSubmit={handleSubmit}>
        <FormGroup style={{ width: '50%', margin: 'auto' }}>
          <TextField
            value={name}
            onChange={handleChangeName}
            label={labels['LABEL_INGREDIENTS_NAME']}
            required
          />
          <TextField
            value={unit}
            onChange={handleChangeUnit}
            label={labels['LABEL_INGREDIENTS_UNIT']}
            required
          />
          <TextField
            type="number"
            value={price}
            onChange={handleChangePrice}
            label={labels['LABEL_INGREDIENTS_PRICE']}
            required
            inputProps={{ min: '0.01', step: '0.01' }}
          />
          <Button type="submit">{labels['LINK_INGREDIENTS_EDIT']}</Button>
        </FormGroup>
      </form>
    </Box>
  );
}
const mapStateToProps = (state) => ({
  ingredient: state.ingredients.shown,
  user: state.user,
  settings: state.settings,
});
const mapDispatchToProps = (dispatch) => ({
  fetchIngredient: (token, id) => dispatch(fetchIngredient(token, id)),
  editIngredient: (token, id, ingredient) =>
    dispatch(editIngredient(token, id, ingredient)),
});
export default connect(mapStateToProps, mapDispatchToProps)(EditIngredientPage);
