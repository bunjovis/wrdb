import React, { useState } from 'react';
import Link from 'react-router-dom/Link';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import { connect } from 'react-redux';
import FormGroup from '@material-ui/core/FormGroup';
import Button from '@material-ui/core/Button';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import SettingsIcon from '@material-ui/icons/Settings';
import { userLogin, userLogout } from '../actions/user';

function Login(props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleChangeEmail = (event) => {
    setEmail(event.target.value);
  };
  const handleChangePassword = (event) => {
    setPassword(event.target.value);
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    props.userLogin(email, password);
  };
  const handleLogout = () => {
    setEmail('');
    setPassword('');
    props.userLogout();
  };
  console.log(props);
  return (
    <Box>
      {props.user.token == null ? (
        <Box>
          {props.message == 'Login failed' ? props.message : ''}
          <form onSubmit={handleSubmit}>
            <FormGroup row>
              <TextField
                id="email"
                label="Email"
                required
                type="email"
                value={email}
                onChange={handleChangeEmail}
              />
              <TextField
                id="password"
                label="Password"
                required
                type="password"
                value={password}
                onChange={handleChangePassword}
              />
              <Button
                disabled={email == '' || password == ''}
                type="submit"
                startIcon={<LockOpenIcon />}
              >
                Login
              </Button>
            </FormGroup>
          </form>
        </Box>
      ) : (
        <Box>
          <Link to="/settings" style={{ textDecoration: 'none' }}>
            <Button startIcon={<SettingsIcon />}>Settings</Button>
          </Link>
          <Link to="/users" style={{ textDecoration: 'none' }}>
            <Button startIcon={<AccountBoxIcon />}>Profile</Button>
          </Link>
          <Button onClick={handleLogout} startIcon={<ExitToAppIcon />}>
            Logout
          </Button>
        </Box>
      )}
    </Box>
  );
}
const mapStateToProps = (state) => ({
  user: state.user,
  message: state.message,
});
const mapDispatchToProps = (dispatch) => ({
  userLogin: (email, password) => {
    dispatch(userLogin(email, password));
  },
  userLogout: () => {
    dispatch(userLogout());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
