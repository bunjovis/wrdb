const mongoose = require('mongoose');

function connect(dbConfig) {
  mongoose
    .connect(`mongodb://${dbConfig.host}:${dbConfig.port}/${dbConfig.db}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    })
    .then(() => {
      mongoose.connection.on('error', (err) => {
        console.log(err);
      });
      mongoose.connection.on('reconnectFailed', (err) => {
        console.log(err);
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

function disconnect() {
  mongoose.disconnect();
}

module.exports = { connect, disconnect };
