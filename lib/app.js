const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.static(__dirname + '/../public'));

app.use(express.json());
app.use(require('cookie-parser')());
app.use(cors({ origin: true, credentials: true, configuration: true }));


app.use('/api/v1/auth', require('./routes/users'));
app.use('/ap1/v1/auth', require('./routes/events'));
app.use('/api/v1/positives', require('./routes/positives'));
app.use('/api/v1/moods', require('./routes/moods'));
app.use('/api/v1/images', require('./routes/images'));

app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
