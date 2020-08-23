import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import { fetchSettings, saveSettings } from '../../actions/settings';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import translations from '../../misc/translations.json';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';

function SettingsPage(props) {
  console.log(props.settings);
  const labels = translations[props.settings.language];
  const languages = Object.getOwnPropertyNames(translations);
  const [file, setFile] = useState(null);
  const [fileSize, setFileSize] = useState(null);
  const [language, setLanguage] = useState(props.settings.language);
  const [darkMode, setDarkMode] = useState(props.settings.darkMode);
  const [changed, setChanged] = useState(false);
  const [added, setAdded] = useState(null);
  const fileRef = useRef();
  console.log(added);
  function handleAddPictureClick(e) {
    if (!file) {
      fileRef.current.click();
    } else {
      handleSavePicture(e);
    }
  }
  function handleSavePicture(e) {
    const form = new FormData();
    form.append('image', file);
    fetch('../api/settings/logo', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + props.user.token },
      body: form,
    }).then((res) => {
      if (res.status === 200) {
        setAdded(true);
      } else {
        setAdded(false);
      }
    });
    fileRef.current.value = '';
    setFile(null);
    setFileSize(null);
  }
  function handleFileChange(e) {
    setFile(e.target.files[0]);
    setFileSize(e.target.files[0].size);
  }
  function validateFileSize(size) {
    const MAXSIZE = 5242880; // Maximum file size: 5MB

    if (size === null || size <= MAXSIZE) {
      return true;
    } else {
      return false;
    }
  }
  function handleLanguageChange(event) {
    setLanguage(event.target.value);
    setChanged(true);
  }
  function handleDarkModeChange(event) {
    setDarkMode(!darkMode);
    setChanged(true);
  }
  useEffect(() => {
    if (changed) {
      handleSettingsChange();
      setChanged(false);
    }
  }, [language, darkMode]); // eslint-disable-line
  function handleSettingsChange() {
    props.saveSettings(props.user.token, { language, darkMode });
  }
  useEffect(() => {
    props.fetchSettings(props.user.token);
  }, []); // eslint-disable-line
  useEffect(() => {
    setDarkMode(props.settings.darkMode);
    setLanguage(props.settings.language);
  }, [props.settings]);
  return (
    <Box>
      <Typography variant="h2">{labels['LABEL_SETTINGS']}</Typography>
      <FormControl style={{ minWidth: 120 }}>
        <InputLabel htmlFor="language">
          {labels['LABEL_SETTINGS_LANGUAGE']}
        </InputLabel>
        <Select id="language" value={language} onChange={handleLanguageChange}>
          {languages.map((language) => (
            <MenuItem value={language}>{language}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <br />
      <FormControlLabel
        control={<Switch checked={darkMode} onChange={handleDarkModeChange} />}
        label={labels['LABEL_SETTINGS_DARKMODE']}
      />
      <br />
      <Typography variant="h4">{labels['LABEL_SETTINGS_LOGO']}</Typography>
      {added == null ? (
        <img alt="logo" src="../logo.png" />
      ) : added === true ? (
        labels['LABEL_SETTINGS_ADDED']
      ) : (
        labels['LABEL_SETTINGS_FAILED']
      )}
      <br />
      <FormControlLabel
        label={file ? file.name : null}
        control={
          <Button
            variant="outlined"
            style={{ margin: 5 }}
            onClick={handleAddPictureClick}
          >
            {file
              ? labels['LABEL_SETTINGS_SAVE']
              : labels['LABEL_SETTINGS_UPLOAD']}
          </Button>
        }
      />
      <input
        style={{ display: 'none' }}
        type="file"
        ref={fileRef}
        name="picture"
        accept="image/png, image/jpeg"
        onChange={handleFileChange}
      />
      {validateFileSize(fileSize) ? (
        ''
      ) : (
        <Alert severity="error">{labels['LABEL_SETTINGS_FILE_BIG']}</Alert>
      )}
    </Box>
  );
}
const mapStateToProps = (state) => ({
  user: state.user,
  settings: state.settings,
});
const mapDispatchToProps = (dispatch) => ({
  fetchSettings: (token) => dispatch(fetchSettings(token)),
  saveSettings: (token, settings) => dispatch(saveSettings(token, settings)),
});
export default connect(mapStateToProps, mapDispatchToProps)(SettingsPage);
