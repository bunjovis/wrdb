import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableFooter from '@material-ui/core/TableFooter';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import { fetchWine } from '../../actions/wines';
import { fetchIngredients3 } from '../../actions/ingredients';
import translations from '../../misc/translations.json';

function ShowWinePage(props) {
  const labels = translations[props.settings.language];
  function getIngredientName(type) {
    const ingredient = props.ingredients.filter(
      (i) => i._id.toString() == type
    )[0];
    return ingredient ? ingredient.name : '';
  }
  function getIngredientUnit(type) {
    const ingredient = props.ingredients.filter(
      (i) => i._id.toString() == type
    )[0];
    return ingredient ? ingredient.unit : '';
  }
  function getIngredientPrice(type) {
    const ingredient = props.ingredients.filter(
      (i) => i._id.toString() == type
    )[0];
    return ingredient ? ingredient.price : '';
  }
  useEffect(() => {
    props.fetchIngredients(props.user.token);
    props.fetchWine(props.user.token, props.match.params.id);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  if (props.wine == null || props.ingredients == null) {
    return (
      <Box>
        <Typography variant="h2">{labels['LABEL_WINE_SHOW']}</Typography>
        <Alert severity="info">
          <AlertTitle>{labels['LABEL_INFO']}</AlertTitle>
          {labels['LABEL_WINE_EMPTY']}
        </Alert>
      </Box>
    );
  } else {
    return (
      <Box>
        <Typography variant="h2">
          {labels['LABEL_WINE_SHOW']} {props.wine.name}
        </Typography>
        <img
          width="300"
          src={'../../img/labels/' + (props.wine.labelId || 'nolabel') + '.png'}
        />
        <br />
        {labels['LABEL_WINES_STARTINGDATE']}:{' '}
        {new Date(props.wine.createdAt).toDateString()}
        <br />
        {labels['LABEL_WINES_BOTTLINGDATE']}:{' '}
        {props.wine.bottlingDate
          ? new Date(props.wine.bottlingDate).toDateString()
          : labels['LABEL_WINES_NOT_BOTTLED']}
        <br />
        {labels['LABEL_WINES_TOTALCOST']}: {props.wine.totalCost}
        <br />
        {labels['LABEL_WINES_STARTINGGRAVITY']}: {props.wine.startingGravity}
        <br />
        {labels['LABEL_WINES_FINALGRAVITY']}:{' '}
        {props.wine.finalGravity || labels['LABEL_WINES_NOT_BOTTLED']}
        <br />
        {labels['LABEL_WINES_STARTINGVOLUME']}: {props.wine.startingVolume}
        <br />
        {labels['LABEL_WINES_FINALVOLUME']}:{' '}
        {props.wine.finalVolume || labels['LABEL_WINES_NOT_BOTTLED']}
        <br />
        {labels['LABEL_WINES_ALCOHOLCONTENT']}:{' '}
        {props.wine.alcoholContent
          ? props.wine.alcoholContent.toFixed(1)
          : labels['LABEL_WINES_NOT_BOTTLED']}
        <br />
        <Typography variant="h4">
          {labels['LABEL_WINES_INGREDIENTS']}
        </Typography>
        <TableContainer style={{ width: '50%', margin: 'auto' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>{labels['LABEL_INGREDIENTS_NAME']}</TableCell>
                <TableCell>{labels['LABEL_INGREDIENTS_AMOUNT']}</TableCell>
                <TableCell>{labels['LABEL_INGREDIENTS_COMMENT']}</TableCell>
                <TableCell>{labels['LABEL_INGREDIENTS_COST']}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {props.wine.ingredients.map((ingredient) => (
                <TableRow>
                  <TableCell>{getIngredientName(ingredient.type)}</TableCell>
                  <TableCell>
                    {ingredient.amount +
                      ' ' +
                      getIngredientUnit(ingredient.type)}
                  </TableCell>
                  <TableCell>{ingredient.comment}</TableCell>
                  <TableCell>
                    {ingredient.amount * getIngredientPrice(ingredient.type)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Typography variant="h4">{labels['LABEL_WINES_COMMENTS']}</Typography>
        <TableContainer style={{ width: '50%', margin: 'auto' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>{labels['LABEL_WINES_COMMENT_DATE']}</TableCell>
                <TableCell>{labels['LABEL_WINES_COMMENT']}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {props.wine.comments.map((comment) => (
                <TableRow>
                  <TableCell>
                    {new Date(comment.createdAt).toLocaleDateString(
                      props.settings.language
                    )}
                  </TableCell>
                  <TableCell>{comment.text}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  }
}
const mapStateToProps = (state) => ({
  wine: state.wines.shown,
  ingredients: state.ingredients.list,
  user: state.user,
  settings: state.settings,
});
const mapDispatchToProps = (dispatch) => ({
  fetchWine: (token, id) => dispatch(fetchWine(token, id)),
  fetchIngredients: (token) => dispatch(fetchIngredients3(token)),
});
export default connect(mapStateToProps, mapDispatchToProps)(ShowWinePage);
