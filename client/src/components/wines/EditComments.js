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

function EditComments(props) {
  const labels = translations[props.settings.language];
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [deleted, setDeleted] = useState(false);

  function handleChangeComment(event) {
    setComment(event.target.value);
  }
  function handleSubmit(event) {
    event.preventDefault();
    if (event.target.checkValidity()) {
      comments.push({
        text: comment,
      });
      props.handleCommentChange(comments);
      setComment('');
    }
  }
  function handleDelete(index) {
    comments.splice(index, 1);
    props.handleCommentChange(comments);
    setDeleted(true);
  }
  useEffect(() => {
    setComments(props.comments);
    setDeleted(false);
  }, [deleted, props.comments]);
  return (
    <Box>
      {comments.length > 0 ? (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{labels['LABEL_WINES_COMMENT']}</TableCell>
              <TableCell>{labels['LABEL_INGREDIENTS_ACTIONS']}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {comments.map((comment, index) => (
              <TableRow>
                <TableCell>{comment.text}</TableCell>

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
        labels['LABEL_WINES_NO_COMMENTS']
      )}
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <TextField
            value={comment}
            onChange={handleChangeComment}
            label={labels['LABEL_WINES_COMMENT']}
            required
            inputProps={{ minLength: '1', maxLength: '2000' }}
            multiline
          />
          <Button type="submit">{labels['LINK_WINES_ADD_COMMENT']}</Button>
        </FormGroup>
      </form>
    </Box>
  );
}
const mapStateToProps = (state) => ({
  settings: state.settings,
});
export default connect(mapStateToProps)(EditComments);
