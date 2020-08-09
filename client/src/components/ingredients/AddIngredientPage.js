import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import { addIngredient } from '../../actions/ingredients';
import translations from '../../misc/translations.json';
import FormGroup from '@material-ui/core/FormGroup';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';

function AddIngredientPage(props) {
  const labels = translations[props.settings.language];
  const [name, setName] = useState('');
  const [unit, setUnit] = useState('');
  const [price, setPrice] = useState(0.01);
  const [redirect, setRedirect] = useState(null);
  const [added, setAdded] = useState(false);
  const handleSubmit = (event) => {
    event.preventDefault();
    if (event.target.checkValidity()) {
      props.addIngredient(props.user.token, {
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
  if (redirect != null) {
    return <Redirect to={redirect} />;
  }
  return (
    <Box>
      <Typography variant="h2">{labels['LINK_INGREDIENTS_NEW']}</Typography>
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
          <Button type="submit">{labels['LINK_INGREDIENTS_ADD']}</Button>
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
  addIngredient: (token, ingredient) =>
    dispatch(addIngredient(token, ingredient)),
});
export default connect(mapStateToProps, mapDispatchToProps)(AddIngredientPage);
