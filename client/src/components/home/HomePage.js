import React, { useState } from 'react';
import { connect } from 'react-redux';
import Box from '@material-ui/core/Box';
import { fetchWines } from '../../actions/wines';
import translations from '../../misc/translations.json';
import { Typography } from '@material-ui/core';

function HomePage(props) {
  const labels = translations[props.settings.language];
  return (
    <Box>
      <Typography variant="h2">{labels['LABEL_HOME']}</Typography>
      {labels['LABEL_HOME_TOTAL_WINES']}: {props.wines.length}
    </Box>
  );
}
const mapStateToProps = (state) => ({
  wines: state.wines.list,
  user: state.user,
  settings: state.settings,
});
const mapDispatchToProps = (dispatch) => ({
  fetchWines: (token) => dispatch(fetchWines(token)),
});
export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
