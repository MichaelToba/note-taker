const express = require('express');
const app = express();
const PORT = process.env.PORT || 3003;

// Import routes
const htmlRoutes = require('./routes/htmlRoutes');
const apiRoutes = require('./routes/apiRoutes');

app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Mount the API and HTML routes
app.use('/api', apiRoutes);
app.use('/', htmlRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`App listening on PORT ${PORT}`);
});

module.exports = app;





