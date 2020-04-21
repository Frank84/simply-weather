import geolocator from 'geolocator';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Icon } from 'semantic-ui-react'

import './App.css';

import WeatherDetails from './components/weather-details';
import defaultBackgroundImage from './images/background.png';
import { getRandomInt } from './utilities/utils';

function App() {
  const [currentLocation, setCurrentLocation] = useState('');
  const [currentWeather, setCurrentWeather] = useState({
    current: {},
    historical: {},
    location: { name: '' },
  });
  const [degreeUnit, setDegreeUnit] = useState('c');
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [locationBackgroundImage, setLocationBackgroundImage] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [submitValue, setSubmitValue] = useState('');

  async function getWeather(query: string) {
    // Getting weather forecast and historical data using WeatherStack API.
    // Please note that we are using the free version of the API. 
    // For this reason, historical data will be use for the forecast.
    // Parameters passed: 
    // - range: string of the past 30 days.
    // - query: name of the city requested
    // - unit: m (metrics) f (fahrenheit)
    setIsError(false);
    setLoading(true);
    const range = getStringDays(30);
    await fetch(`/weather/historical?t=${range}&q=${query}&unit=${degreeUnit}`)
      .then((response) => {
        if (response.status >= 400 && response.status < 600) {
          setIsError(true);
          throw new Error("Bad response from server");
        }
        return response;
      }).then((returnedResponse) => {
        returnedResponse.json()
          .then((parsedJson) => {
            const results = parsedJson.results;
            setCurrentWeather({ current: results.current, location: results.location, historical: results.historical });
            setCurrentLocation(results.location.name);
          });
      }).catch((error) => {
        setIsError(true);
        console.error(error);
      }).finally(() => {
        setLoading(false);
      });
  }

  async function getBackgroundImage(query: string) {
    // Try to get a background image based on the city selected using Unsplash API.
    // Use Unsplash API. If no result found, or error, use default background image. 
    try {
      const apiQuery = await fetch(`/images?q=${query}`);
      const parsedJson = await apiQuery.json();
      if (parsedJson && parsedJson.results && parsedJson.results.results) {
        const results = parsedJson.results.results;
        const randomIndex = getRandomInt(results.length);
        setLocationBackgroundImage(results[randomIndex].urls.regular);
      } else {
        setLocationBackgroundImage(defaultBackgroundImage);
      }
    }
    catch {
      setLocationBackgroundImage(defaultBackgroundImage);
    }
  }

  async function searchNewLocation(e: React.SyntheticEvent<EventTarget>) {
    e.preventDefault();
    await getWeather(submitValue);
    setMenuOpen(false);
  }

  function getStringDays(numberOfdays: Number): string {
    // This return a string in the format expected by WeatherStack API.
    // Format: 'YYYY-MM-DD;YYYY-MM-DD...'
    let range = '';
    for (let i = 0; i < numberOfdays; i++) {
      let date = moment().subtract(i, 'days').format('YYYY-MM-DD') + ';';
      range = range + date;
    } 
    return range.substring(0, range.length - 1);
  }

  useEffect(() => {
    if (currentWeather && currentWeather.location) {
      // Make sure the location is a different one before getting new picture.
      if (currentWeather.location.name !== currentLocation) {
        getBackgroundImage(currentWeather.location.name)
      }
    }
  }, [currentWeather]);

  useEffect(() => {
    var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumWait: 10000,     // max wait time for desired accuracy
        maximumAge: 0,          // disable cache
        desiredAccuracy: 30,    // meters
        fallbackToIP: true,     // fallback to IP if Geolocation fails or rejected
    };
    geolocator.locate(options, function (err: any, location: any) {
        if (err) return console.log(err);
        if (location && location.address && location.address.city) {
          getWeather(location.address.city);
        } else if (location && location.coords) {
          getWeather(location.coords.latitude + ',' + location.coords.longitude);
        } else {
          setMenuOpen(true);
        }
    });
  }, []);

  function renderNewLocationForm() {
    return (
      <div>
        <form onSubmit={searchNewLocation}>
          <div className={`ui action transparent input ${loading ? 'loading' : ''}`}>
            <input autoFocus type="text" onChange={(e) => setSubmitValue(e.target.value)} placeholder="Search a city" />
            <i className={`search icon`} onClick={searchNewLocation}></i>
          </div>
        </form>
        <Icon className={`search-close ${menuOpen ? 'active' : ''}`} onClick={() => { setMenuOpen(false) }} name='close' />
      </div>
    )
  }

  return (
    <div className="app" style={{backgroundImage: `url(${locationBackgroundImage})`}}>
      <header className="app-header">
        <h1 className="logo">
          <Icon className='logo-icon rotating' name='sun' /> 
          Simply Weather
        </h1>
        <div className={`search-wrapper ${menuOpen ? 'active' : '' }`}>
          { menuOpen ? renderNewLocationForm() : 
            <Icon name='search' onClick={() => { setMenuOpen(true) }} /> 
          }
        </div>
      </header>
      <main className="app-main">
        { !isError ? currentWeather.location.name ?
          <WeatherDetails getWeather={getWeather} currentWeather={currentWeather} degreeUnit={{degreeUnit, setDegreeUnit}} /> :
          <div className="load ui active dimmer"><div className="ui loader"></div></div> :
          <div>Oops, something went wrong. <span style={{ textDecoration: 'underline', cursor: 'default' }} onClick={() => { getWeather(currentLocation) }}>Please try again.</span></div>
        }
      </main>
    </div>
  );
}

export default App;