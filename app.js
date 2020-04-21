require("dotenv").config();
var cors = require("cors");
const express = require("express");
const app = express();
const fetch = require("node-fetch");
const path = require('path');
const port = process.env.PORT || 5000;

const API_WEATHER_KEY = '21c5515619d98661c24bc66048250c9c';
const API_WEATHER_ENDPOINT = 'http://api.weatherstack.com';
const API_IMAGES_ENDPOINT = 'https://api.unsplash.com';
const API_IMAGES_KEY = 'T3kfr7XcC4-yB8siCj080DRwizjaZTYhE7SKyhZf1zM';

app.use(cors());

app.use(express.static(path.join(__dirname, 'client/build')));

// Routes

// Images api route
app.get("/images", async (req, res) => {
  try {
    // It uses node-fetch to call the api, and reads the key from the constant
    const response = await fetch(
      `${API_IMAGES_ENDPOINT}/search/photos?page=1&query=${req.query.q}&client_id=${API_IMAGES_KEY}`,
    );

    // waiting for response
    const json = await response.text();

    // we parse the result
    const results = JSON.parse(json)
    return res.json({
      success: true,
      results,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// Historical weather route
app.get("/weather/historical", async (req, res) => {
  try {
    // This uses string interpolation to make our search query string
    // it pulls the posted query param and reformats it.
    const unit = req.query.unit === 'f' ? 'f' : 'm'; 
    const searchString = `query=${req.query.q}&historical_date=${req.query.t}&units=${unit}`;

    // It uses node-fetch to call the api, and reads the key from the constant
    const response = await fetch(
      `${API_WEATHER_ENDPOINT}/historical?access_key=${API_WEATHER_KEY}&${searchString}`,
      );

    // waiting for response
    const json = await response.text();

    // we parse the result
    const results = JSON.parse(json)
    return res.json({
      success: true,
      results,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// Other route point to our react app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

app.listen(port, () => console.log(`Listening on port ${port}!`));
