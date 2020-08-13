import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import { addWine } from '../../actions/wines';
import { fetchIngredients } from '../../actions/ingredients';
import translations from '../../misc/translations.json';
import FormGroup from '@material-ui/core/FormGroup';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';

function AddWinePage(props) {
  const labels = translations[props.settings.language];
  const [name, setName] = useState('');
  const [startingGravity, setStartingGravity] = useState(null);
  const [finalGravity, setFinalGravity] = useState(null);
  const [startingVolume, setStartingVolume] = useState(null);
  const [finalVolume, setFinalVolume] = useState(null);
  const [bottlingDate, setBottlingDate] = useState(null);
  const [comments, setComments] = useState([]);
  const [labelId, setLabelId] = useState(null);

  const [redirect, setRedirect] = useState(null);
  const [added, setAdded] = useState(false);
  const handleSubmit = (event) => {
    event.preventDefault();
    if (event.target.checkValidity()) {
      setAdded(true);
    }
  };
  const handleChangeName = (event) => {
    setName(event.target.value);
  };
  const handleChangeSG = (event) => {
    setStartingGravity(event.target.value);
  };
  const handleChangeFG = (event) => {
    setFinalGravity(event.target.value);
  };
  const handleChangeSV = (event) => {
    setStartingVolume(event.target.value);
  };
  const handleChangeFV = (event) => {
    setFinalVolume(event.target.value);
  };
  const handleChangeBD = (event) => {
    setBottlingDate(event.target.value);
  };

  useEffect(() => {
    props.fetchIngredients(props.user.token);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (props.ingredient && added) {
      setAdded(false);
      setRedirect('/wines/' + props.ingredient._id + '/show');
    }
  }, [added, props]);
  if (redirect != null) {
    return <Redirect to={redirect} />;
  }
  return (
    <Box>
      <Typography variant="h2">{labels['LABEL_WINES_NEW']}</Typography>
      <form onSubmit={handleSubmit}>
        <FormGroup style={{ width: '50%', margin: 'auto' }}>
          <TextField
            value={name}
            onChange={handleChangeName}
            label={labels['LABEL_WINES_NAME']}
            required
          />
          <TextField
            value={startingGravity}
            onChange={handleChangeSG}
            label={labels['LABEL_WINES_STARTINGGRAVITY']}
            required
          />
          <TextField
            value={finalGravity}
            onChange={handleChangeFG}
            label={labels['LABEL_WINES_FINALGRAVITY']}
          />
          <TextField
            value={startingVolume}
            onChange={handleChangeSV}
            label={labels['LABEL_WINES_STARTINGVOLUME']}
            required
          />
          <TextField
            value={finalVolume}
            onChange={handleChangeFV}
            label={labels['LABEL_WINES_FINALVOLUME']}
          />
          <TextField value={bottlingDate} type="date" />
          <Typography variant="h4">
            {labels['LABEL_WINES_INGREDIENTS']}
          </Typography>
          <Button>{labels['LINK_INGREDIENTS_ADD']}</Button>
          <Typography variant="h4">{labels['LABEL_WINES_COMMENTS']}</Typography>
          <Button>{labels['LINK_WINES_ADD_COMMENT']}</Button>
          <Typography variant="h4">
            {labels['LABEL_WINES_LABEL_EDITOR']}
          </Typography>
          <Button>{labels['LINK_WINES_ADD_LABEL']}</Button>
          <Button type="submit">{labels['LINK_WINES_ADD']}</Button>
        </FormGroup>
      </form>
    </Box>
  );
}
const mapStateToProps = (state) => ({
  wine: state.wines.shown,
  ingredients: state.ingredients.list,
  user: state.user,
  settings: state.settings,
});
const mapDispatchToProps = (dispatch) => ({
  addWine: (token, wine) => dispatch(addWine(token, wine)),
  fetchIngredients: (token) => dispatch(fetchIngredients(token)),
});
export default connect(mapStateToProps, mapDispatchToProps)(AddWinePage);
