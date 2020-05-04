const express = require('express');
const helmet = require('helmet');
const path = require('path');
//const db = require('./db');
//const apiRoutes = require('./routes/apiRoutes');

const app = express();

// Open MongoDB connection
const dbConfig = {
  host: 'localhost',
  port: '27017',
  db: 'winedb',
};
// db.connect(dbConfig);

// Run setup script
// require('./setup');

// Choose port according to environment used
let port;
if (process.env.NODE_ENV === 'dev') {
  port = 3001;
} else {
  port = 3000;
}
// Use helmet middleware
app.use(helmet());

// Use JSON parser
app.use(express.json());
// Serve API routes
// app.use('/api', apiRoutes);

// Serve static React app
app.use(express.static('client/build'));
app.get('*', (req, res) => {
  res.sendFile(path.resolve('client', 'build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

// Export for testing
module.exports = app;
