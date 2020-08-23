const Settings = require('../models/Settings');

const showSettings = (req, res) => {
  Settings.find((err, res2) => {
    if (res2 && res2.length === 1) {
      console.log(res2);
      return res.status(200).json({ settings: res2[0] });
    } else {
      return res.status(200).json({
        settings: {
          darkMode: true,
          language: 'en',
        },
      });
    }
  });
};
const setSettings = (req, res) => {
  const { language, darkMode } = req.body;
  Settings.find((err, res2) => {
    if (!res2[0]) {
      const settings = new Settings({ language, darkMode });
      return settings.save((prod) => res.status(200).json({ settings: prod }));
    } else {
      res2[0].language = language;
      res2[0].darkMode = darkMode;
      return res2[0].save(
        (err2, prod) => res.status(200).json({ settings: prod }) //eslint-disable-line
      );
    }
  });
};
const addLogo = (req, res) => {
  if (req.file) {
    return res.status(200).json({ message: 'Logo added' });
  } else {
    return res.status(500).json({ message: 'Error occured' });
  }
};

module.exports = {
  showSettings,
  setSettings,
  addLogo,
};
