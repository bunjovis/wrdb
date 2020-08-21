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
import { fetchWines } from '../../actions/wines';
import translations from '../../misc/translations.json';

function WinesPage(props) {
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
    props.fetchWines(props.user.token);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (props.wines == null || props.wines.length == 0) {
    return (
      <Box>
        <Typography variant="h2">{labels['LABEL_WINES']}</Typography>
        <Link to="/wines/new">
          <IconButton>
            <AddBoxIcon />
            {labels['LINK_WINES_NEW']}
          </IconButton>
        </Link>
        <Alert severity="info">
          <AlertTitle>{labels['LABEL_INFO']}</AlertTitle>
          {labels['LABEL_WINES_EMPTY']}
        </Alert>
      </Box>
    );
  } else {
    const emptyRows =
      rowsPerPage -
      Math.min(rowsPerPage, props.wines.length - page * rowsPerPage);
    return (
      <Box>
        <Typography variant="h2">{labels['LABEL_WINES']}</Typography>
        <Link to="/wines/new">
          <IconButton>
            <AddBoxIcon />
            {labels['LINK_WINES_NEW']}
          </IconButton>
        </Link>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>{labels['LABEL_WINES_NAME']}</TableCell>
                <TableCell>{labels['LABEL_WINES_BOTTLINGDATE']}</TableCell>
                <TableCell>{labels['LABEL_WINES_ALCOHOLCONTENT']}</TableCell>
                <TableCell align="right">
                  {labels['LABEL_WINES_ACTIONS']}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {props.wines
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((wine) => (
                  <TableRow key={wine._id}>
                    <TableCell>{wine.name}</TableCell>
                    <TableCell>{wine.bottlingDate}</TableCell>
                    <TableCell>{wine.alcoholContent}</TableCell>
                    <TableCell align="right">
                      <Link to={'/wines/' + wine._id + '/show'}>
                        <IconButton color="primary">
                          <SearchIcon />
                        </IconButton>
                      </Link>
                      <Link to={'/wines/' + wine._id + '/edit'}>
                        <IconButton color="primary">
                          <EditIcon />
                        </IconButton>
                      </Link>
                      <Link to={'/wines/' + wine._id + '/delete'}>
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
                  count={props.wines.length}
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
  wines: state.wines.list,
  user: state.user,
  settings: state.settings,
});
const mapDispatchToProps = (dispatch) => ({
  fetchWines: (token) => dispatch(fetchWines(token)),
});
export default connect(mapStateToProps, mapDispatchToProps)(WinesPage);
