import React, { useState } from 'react';
import Link from 'react-router-dom/Link';
import { connect } from 'react-redux';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Box from '@material-ui/core/Box';
import HomeIcon from '@material-ui/icons/Home';
import LocalBarIcon from '@material-ui/icons/LocalBar';
import LocalGroceryStoreIcon from '@material-ui/icons/LocalGroceryStore';
import Button from '@material-ui/core/Button';
import PeopleIcon from '@material-ui/icons/People';
import Login from './Login';
import UserRole from '../misc/UserRole';

function Navigation(props) {
  return (
    <AppBar position="sticky" className="navigationBar">
      <Toolbar>
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          minWidth="100%"
        >
          <Box display="flex" flexDirection="row">
            <Link to="/" style={{ textDecoration: 'none' }}>
              <Button startIcon={<HomeIcon />}>Home</Button>
            </Link>
            {props.user.token != null ? (
              <Box>
                <Link to="/wines" style={{ textDecoration: 'none' }}>
                  <Button startIcon={<LocalBarIcon />}>Wines</Button>
                </Link>
                <Link to="/ingredients" style={{ textDecoration: 'none' }}>
                  <Button startIcon={<LocalGroceryStoreIcon />}>
                    Ingredients
                  </Button>
                </Link>
                {props.user.role == UserRole.ADMIN ? (
                  <Link to="/users" style={{ textDecoration: 'none' }}>
                    <Button startIcon={<PeopleIcon />}>Users</Button>
                  </Link>
                ) : (
                  ''
                )}
              </Box>
            ) : (
              ''
            )}
          </Box>
          <Box display="flex" flexDirection="row">
            <Login />
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
const mapStateToProps = (state) => ({
  user: state.user,
});
export default connect(mapStateToProps)(Navigation);
