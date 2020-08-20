import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableFooter from '@material-ui/core/TableFooter';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import FormGroup from '@material-ui/core/FormGroup';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import translations from '../../misc/translations.json';

function EditIngredients(props) {
  const labels = translations[props.settings.language];
  const [amount, setAmount] = useState(0);
  const [selectedIngredient, setSelectedIngredient] = useState('');
  const [comment, setComment] = useState('');
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [deleted, setDeleted] = useState(false);

  function getIngredientName(type) {
    const ingredient = props.ingredients.filter(
      (i) => i._id.toString() == type
    )[0];
    return ingredient.name;
  }
  function getIngredientUnit(type) {
    const ingredient = props.ingredients.filter(
      (i) => i._id.toString() == type
    )[0];
    return ingredient.unit;
  }
  function handleChangeAmount(event) {
    setAmount(event.target.value);
  }
  function handleChangeComment(event) {
    setComment(event.target.value);
  }
  function handleChangeIngredient(event) {
    console.log(event.target.value);
    setSelectedIngredient(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (event.target.checkValidity()) {
      const newIngredient = { type: selectedIngredient._id, amount };
      if (comment.length > 0) {
        newIngredient.comment = comment;
      }
      selectedIngredients.push(newIngredient);
      props.handleIngredientChange(selectedIngredients);
      setAmount(0);
      setSelectedIngredient('');
      setComment('');
    }
  }
  function handleDelete(index) {
    selectedIngredients.splice(index, 1);
    props.handleIngredientChange(selectedIngredients);
    setDeleted(true);
  }
  useEffect(() => {
    setSelectedIngredients(props.chosenIngredients);
    setDeleted(false);
  }, [deleted, props.chosenIngredients]);
  return (
    <Box>
      {selectedIngredients.length > 0 ? (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{labels['LABEL_INGREDIENTS_NAME']}</TableCell>
              <TableCell>{labels['LABEL_INGREDIENTS_AMOUNT']}</TableCell>
              <TableCell>{labels['LABEL_INGREDIENTS_COMMENT']}</TableCell>
              <TableCell>{labels['LABEL_INGREDIENTS_ACTIONS']}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {selectedIngredients.map((ingredient, index) => (
              <TableRow>
                <TableCell>{getIngredientName(ingredient.type)}</TableCell>
                <TableCell>{ingredient.amount}</TableCell>
                <TableCell>{ingredient.comment}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleDelete(index)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        labels['LABEL_WINES_NO_INGREDIENTS']
      )}
      <form onSubmit={handleSubmit}>
        <FormGroup row>
          <FormControl style={{ minWidth: 200 }}>
            <InputLabel htmlFor="selectIngredients">
              {labels['LABEL_INGREDIENTS_SELECT']}
            </InputLabel>
            <Select
              id="selectIngredients"
              value={selectedIngredient}
              onChange={handleChangeIngredient}
              required
            >
              {props.ingredients ? (
                props.ingredients.map((ingredient) => (
                  <MenuItem key={ingredient._id} value={ingredient}>
                    {ingredient.name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem></MenuItem>
              )}
            </Select>
          </FormControl>
          <TextField
            type="number"
            value={amount}
            onChange={handleChangeAmount}
            label={labels['LABEL_INGREDIENTS_AMOUNT']}
            required
            inputProps={{ min: '0.01', max: '100', step: '0.01' }}
          />
          <Button type="submit">{labels['LINK_INGREDIENTS_ADD']}</Button>
        </FormGroup>
        <TextField
          value={comment}
          onChange={handleChangeComment}
          label={labels['LABEL_INGREDIENTS_COMMENT']}
          inputProps={{ minLength: '1', maxLength: '2000' }}
        />
      </form>
    </Box>
  );
}
const mapStateToProps = (state) => ({
  settings: state.settings,
});
export default connect(mapStateToProps)(EditIngredients);
