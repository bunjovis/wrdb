const Settings = require('../models/Settings');

const showSettings = (req, res) => {
  Settings.find((err, res2) =>
    res.status(200).json({
    settings: res2[0]
      ? res2[0]
      : {
        darkMode: true,
        language: 'en',
      },
  })
  );
};
const setSettings = (req, res) => {
  const { language, darkMode } = req.body;
  Settings.find((err, res2) => {
    if (!res2[0]) {
      const settings = new Settings({ language, darkMode });
      settings.save((prod) => res.status(200).json({ settings: prod }));
    } else {
      res2[0].language = language;
      res2[0].darkMode = darkMode;
      res2[0].save((err2, prod) => {
        console.log(err2);
        console.log(prod);
        return res.status(200).json({ settings: prod });
      });
    }
  });
};

module.exports = {
  showSettings,
  setSettings,
};
