require("dotenv").config();
const express = require("express");
const path = require('path');
const app = express();
const fetch = require("node-fetch");
const port = process.env.PORT || 3000;
var cors = require("cors");

app.use(cors());

app.use(express.static(path.join(__dirname, 'client/build')));

// Routes
// Images api route
app.get("/images", async (req, res) => {
  try {
    // It uses node-fetch to call the api, and reads the key from .env
    const response = await fetch(
      `${process.env.API_IMAGES_ENDPOINT}/search/photos?page=1&query=${req.query.q}&client_id=${process.env.API_IMAGES_KEY}`,
    );

    // waiting for response
    const json = await response.text();

    // The API returns stuff we don't care about, so we may as well strip out
    // everything except the results:
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

    // It uses node-fetch to call the api, and reads the key from .env
    const response = await fetch(
      `${process.env.API_WEATHER_ENDPOINT}/historical?access_key=${process.env.API_WEATHER_KEY}&${searchString}`,
      );

    // waiting for response
    const json = await response.text();

    // The API returns stuff we don't care about, so we may as well strip out
    // everything except the results:
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

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

app.listen(port, () => console.log(`Listening on port ${port}!`));
