import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
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
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import SearchIcon from '@material-ui/icons/Search';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import AddBoxIcon from '@material-ui/icons/AddBox';
import { fetchIngredients } from '../../actions/ingredients';
import translations from '../../misc/translations.json';

function IngredientsPage(props) {
  const labels = translations[props.settings.language];

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    props.fetchIngredients(props.user.token);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  console.log(props);
  if (props.ingredients == null || props.ingredients.length == 0) {
    return (
      <Box>
        <Typography variant="h2">{labels['LABEL_INGREDIENTS']}</Typography>
        <Link to="/ingredients/new">
          <IconButton>
            <AddBoxIcon />
            {labels['LINK_INGREDIENTS_NEW']}
          </IconButton>
        </Link>
        <Alert severity="info">
          <AlertTitle>{labels['LABEL_INFO']}</AlertTitle>
          {labels['LABEL_INGREDIENTS_EMPTY']}
        </Alert>
      </Box>
    );
  } else {
    const emptyRows =
      rowsPerPage -
      Math.min(rowsPerPage, props.ingredients.length - page * rowsPerPage);
    return (
      <Box>
        <Typography variant="h2">{labels['LABEL_INGREDIENTS']}</Typography>
        <Link to="/ingredients/new">
          <IconButton>
            <AddBoxIcon />
            {labels['LINK_INGREDIENTS_NEW']}
          </IconButton>
        </Link>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>{labels['LABEL_INGREDIENTS_NAME']}</TableCell>
                <TableCell>{labels['LABEL_INGREDIENTS_UNIT']}</TableCell>
                <TableCell>{labels['LABEL_INGREDIENTS_PRICE']}</TableCell>
                <TableCell align="right">
                  {labels['LABEL_INGREDIENTS_ACTIONS']}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {props.ingredients
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((ingredient) => (
                  <TableRow key={ingredient._id}>
                    <TableCell>{ingredient.name}</TableCell>
                    <TableCell>{ingredient.unit}</TableCell>
                    <TableCell>{ingredient.price}</TableCell>
                    <TableCell align="right">
                      <Link to={'/ingredients/' + ingredient._id + '/show'}>
                        <IconButton color="primary">
                          <SearchIcon />
                        </IconButton>
                      </Link>
                      <Link to={'/ingredients/' + ingredient._id + '/edit'}>
                        <IconButton color="primary">
                          <EditIcon />
                        </IconButton>
                      </Link>
                      <Link to={'/ingredients/' + ingredient._id + '/delete'}>
                        <IconButton color="primary">
                          <DeleteIcon />
                        </IconButton>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                  colSpan={4}
                  count={props.ingredients.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onChangePage={handleChangePage}
                  onChangeRowsPerPage={handleChangeRowsPerPage}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Box>
    );
  }
}
const mapStateToProps = (state) => ({
  ingredients: state.ingredients.list,
  user: state.user,
  settings: state.settings,
});
const mapDispatchToProps = (dispatch) => ({
  fetchIngredients: (token) => dispatch(fetchIngredients(token)),
});
export default connect(mapStateToProps, mapDispatchToProps)(IngredientsPage);
