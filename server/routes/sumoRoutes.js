// Import the Express library
const express = require('express');
// Import Axios for making HTTP requests
const axios = require('axios');
// Create a router object to define routes
const router = express.Router();

// Example route for getting a list of sumo wrestlers from the Sumo API
router.get('/wrestlers', async (req, res) => {
    try {
        // Fetch data from the Sumo API
        const response = await axios.get('https://www.sumo-api.com/api/rikishis');

        // Log the full response data to understand its structure
        console.log('Full API Response Data:', response.data);

        // Access the 'records' array from the response
        const wrestlers = response.data.records;

        // Check if wrestlers is an array
        if (!Array.isArray(wrestlers)) {
            console.error('Wrestlers data is not an array:', wrestlers);
            return res.status(500).send('Error: wrestlers data is not an array');
        }

        // Filter the wrestlers to include only those ranked Maegashira and above
        const filteredWrestlers = wrestlers.filter(wrestler => {
            const baseRank = wrestler.currentRank.split(' ')[0]; // Get the rank base (e.g., 'Maegashira' from 'Maegashira 14 West')
            return ['Maegashira', 'Yokozuna', 'Ozeki', 'Komusubi', 'Sekiwake'].includes(baseRank);
        });

        // Send the filtered data as a JSON response
        res.json(filteredWrestlers);
    } catch (error) {
        // Handle errors and send a response
        console.error('Error fetching data from Sumo API:', error.message);
        res.status(500).send('Error fetching data from Sumo API');
    }
});

// Example route for getting a list of matches from the Sumo API
router.get('/matches', async (req, res) => {
    try {
        // Fetch the list of all wrestlers
        const wrestlersResponse = await axios.get('https://www.sumo-api.com/api/rikishis');
        const wrestlers = wrestlersResponse.data.records; // Access the records

        // Filter wrestlers by rank
        const filteredWrestlers = wrestlers.filter(wrestler =>
            ['Maegashira', 'Yokozuna', 'Ozeki', 'Komusubi', 'Sekiwake'].some(rank => 
                wrestler.currentRank.startsWith(rank)
            )
        );

        // Create an array to hold all matches
        const allMatches = [];

        // Loop through each filtered wrestler and fetch their matches
        for (const wrestler of filteredWrestlers) {
            const matchesResponse = await axios.get(`https://www.sumo-api.com/api/rikishi/${wrestler.id}/matches`);
            const matches = matchesResponse.data.records || []; // Access matches or set as empty if undefined

            // Add the matches to the allMatches array
            allMatches.push(...matches);
        }

        // Send the matches as a JSON response
        res.json(allMatches);
    } catch (error) {
        // Enhanced error logging
        console.error('Error fetching data from Sumo API:', error.response ? error.response.data : error.message);
        res.status(500).send('Error fetching data from Sumo API');
    }
});

// New route for fetching basho details
router.get('/basho/:bashoId', async (req, res) => {
    const bashoId = req.params.bashoId;

    try {
        // Fetch data from the Sumo API for the specified bashoId
        const response = await axios.get(`https://www.sumo-api.com/api/basho/${bashoId}`);

        // Assuming the relevant data is within a property called 'data' in the response
        const bashoData = response.data;

        // Send the basho data as a JSON response
        res.json(bashoData);
    } catch (error) {
        // Handle errors and send a response
        console.error('Error fetching data from Sumo API:', error);
        res.status(500).send('Error fetching data from Sumo API');
    }
});


// Export the router to be used in other files
module.exports = router;






