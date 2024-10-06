// Import the Express library
const express = require('express');
// Create an instance of an Express application
const app = express();
// Define the port the server will listen on
const PORT = process.env.PORT || 5000;
// Import the routes from the sumoRoutes file
const sumoRoutes = require('./routes/sumoRoutes');
// Load environment variables from .env file
require('dotenv').config();

// Mount the sumoRoutes at the '/api' base URL
app.use('/api', sumoRoutes);

// Define a default route for the root URL
app.get('/', (req, res) => {
    res.send('Welcome to the Sumo Fantasy League API!');
});

// Start the server and listen on the defined port
app.listen(PORT, () => {
    // Log a message indicating the server is running
    console.log(`Server running at http://localhost:${PORT}`);
});


