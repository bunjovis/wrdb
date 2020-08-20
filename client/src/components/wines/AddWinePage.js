import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import { addWine } from '../../actions/wines';
import { fetchIngredients2 } from '../../actions/ingredients';
import translations from '../../misc/translations.json';
import FormGroup from '@material-ui/core/FormGroup';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';
import EditIngredients from './EditIngredients';
import EditComments from './EditComments';
import EditLabel from './EditLabel';

function AddWinePage(props) {
  const labels = translations[props.settings.language];
  const [name, setName] = useState('');
  const [startingGravity, setStartingGravity] = useState(1100);
  const [finalGravity, setFinalGravity] = useState(null);
  const [startingVolume, setStartingVolume] = useState(25);
  const [finalVolume, setFinalVolume] = useState(null);
  const [bottlingDate, setBottlingDate] = useState(null);
  const [comments, setComments] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [labelId, setLabelId] = useState(null);
  const [isDisabled, setIsDisabled] = useState(true);
  const [alcoholContent, setAlcoholContent] = useState(null);

  const [redirect, setRedirect] = useState(null);
  const [added, setAdded] = useState(false);
  function saveLabel(id) {
    setLabelId(id);
  }
  function getIngredientPrice(type) {
    const ingredient = props.ingredients.filter(
      (i) => i._id.toString() == type
    )[0];
    return ingredient.price;
  }
  const handleSubmit = (event) => {
    event.preventDefault();
    if (event.target.checkValidity()) {
      let totalCost = 0;
      ingredients.forEach((ingredient) => {
        totalCost += getIngredientPrice(ingredient.type) * ingredient.amount;
      });
      const newWine = {
        name,
        startingGravity,
        startingVolume,
        ingredients,
        totalCost,
      };
      if (finalGravity != null) {
        newWine.finalGravity = finalGravity;
      }
      if (finalVolume != null) {
        newWine.finalVolume = finalVolume;
      }
      if (alcoholContent != null) {
        newWine.alcoholContent = alcoholContent;
      }
      if (bottlingDate) {
        newWine.bottlingDate = bottlingDate;
      }
      if (comments) {
        newWine.comments = comments;
      }
      if (labelId) {
        newWine.labelId = labelId;
      }
      props.addWine(props.user.token, newWine);
      setAdded(true);
    }
  };
  function estimateAlcoholContent(sg, fg) {
    return (sg - fg) / 7.5;
  }
  const handleChangeName = (event) => {
    setName(event.target.value);
  };
  const handleChangeSG = (event) => {
    setStartingGravity(event.target.value);
    setAlcoholContent(estimateAlcoholContent(event.target.value, finalGravity));
  };
  const handleChangeFG = (event) => {
    setFinalGravity(event.target.value);
    setAlcoholContent(
      estimateAlcoholContent(startingGravity, event.target.value)
    );
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
  const handleIngredientChange = (newIngredients) => {
    setIngredients(newIngredients);
    if (newIngredients.length > 0) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  };
  const handleCommentChange = (newComments) => {
    setComments(newComments);
  };

  useEffect(() => {
    props.fetchIngredients(props.user.token);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (props.wine && added) {
      setAdded(false);
      setRedirect('/wines/' + props.wine._id + '/show');
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
            inputProps={{ minLength: '1', maxLength: '200' }}
          />
          <TextField
            type="number"
            value={startingGravity}
            onChange={handleChangeSG}
            label={labels['LABEL_WINES_STARTINGGRAVITY']}
            required
            inputProps={{ min: '1000', max: '1200', step: '1' }}
          />
          <TextField
            type="number"
            value={finalGravity}
            onChange={handleChangeFG}
            label={labels['LABEL_WINES_FINALGRAVITY']}
            inputProps={{ min: '990', max: '1200', step: '1' }}
          />
          <TextField
            type="number"
            value={startingVolume}
            onChange={handleChangeSV}
            label={labels['LABEL_WINES_STARTINGVOLUME']}
            required
          />
          <TextField
            type="number"
            value={finalVolume}
            onChange={handleChangeFV}
            label={labels['LABEL_WINES_FINALVOLUME']}
          />
          <TextField
            value={bottlingDate}
            onChange={handleChangeBD}
            type="date"
            label={labels['LABEL_WINES_BOTTLINGDATE']}
            InputLabelProps={{ shrink: true }}
          />

          <Button type="submit" disabled={isDisabled}>
            {labels['LINK_WINES_ADD']}
          </Button>
        </FormGroup>
      </form>
      <Typography variant="h4">{labels['LABEL_WINES_INGREDIENTS']}*</Typography>
      <Box style={{ width: '50%', margin: 'auto' }}>
        <EditIngredients
          chosenIngredients={ingredients}
          ingredients={props.ingredients}
          handleIngredientChange={handleIngredientChange}
        />
        <Typography variant="h4">{labels['LABEL_WINES_COMMENTS']}</Typography>
        <EditComments
          comments={comments}
          handleCommentChange={handleCommentChange}
        />
        <Typography variant="h4">
          {labels['LABEL_WINES_LABEL_EDITOR']}
        </Typography>
        <EditLabel
          labelId={labelId}
          name={name}
          bottlingDate={bottlingDate}
          saveLabelId={saveLabel}
        />
      </Box>
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
  fetchIngredients: (token) => dispatch(fetchIngredients2(token)),
});
export default connect(mapStateToProps, mapDispatchToProps)(AddWinePage);
