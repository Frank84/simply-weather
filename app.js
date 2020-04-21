require("dotenv").config();
const express = require("express");
const fetch = require("node-fetch");
const rateLimit = require("express-rate-limit");
var cors = require("cors");
const app = express();
const port = 3000;

// Rate limiting - limits to 1/sec

// Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
// see https://expressjs.com/en/guide/behind-proxies.html
// app.set('trust proxy', 1);

const limiter = rateLimit({
  windowMs: 1000, // 1 second
  max: 1, // limit each IP to 1 requests per windowMs
});

//  apply to all requests
app.use(limiter);

// Allow CORS from any origin
// app.use(cors());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

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
    // const results = JSON.parse(json).GoodreadsResponse.search.results;

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
    // const results = JSON.parse(json).GoodreadsResponse.search.results;

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


// This spins up our sever and generates logs for us to use.
// Any console.log statements you use in node for debugging will show up in your
// terminal, not in the browser console!
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
