const express = require('express');
const helmet = require('helmet');
const path = require('path');
const db = require('./db');
const routes = require('./routes');
require('dotenv').config();

const app = express();

// Open MongoDB connection
const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  db: process.env.DB,
};
db.connect(dbConfig);

// Run setup script
require('./setup');

// Choose port according to environment used
let port;
if (process.env.NODE_ENV === 'dev') {
  port = 3001;
} else {
  port = process.env.PORT || 3000;
}
// Use helmet middleware
app.use(helmet());

// Use JSON parser
app.use(express.json());
// Serve API routes
app.use('/api', routes);

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
