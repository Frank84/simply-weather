import geolocator from 'geolocator';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Icon } from 'semantic-ui-react'

import './App.css';
import defaultBackgroundImage from './images/background.png';
import SearchInput from './components/search-input';
import WeatherDetails from './components/weather-details';
import { getRandomInt } from './utilities/utils';

import WeatherAPIMocks from './mocks/mocks'
const MOCK_APP = true;

function App() {
  const [currentWeather, setCurrentWeather] = useState({
    current: {},
    historical: {},
    location: { name: '' },
  });
  const [currentLocation, setCurrentLocation] = useState('');
  const [degreeUnit, setDegreeUnit] = useState('c');
  const [isError, setIsError] = useState(false);
  const [isNoResult, setIsNoResult] = useState(false);
  const [locationBackgroundImage, setLocationBackgroundImage] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  async function getWeather(query: string) {

    // No historical data available with current free weather api
    // So for now we are returning mock data.
    if (MOCK_APP) {
      return setCurrentWeather({
        current: WeatherAPIMocks.results.current,
        location: WeatherAPIMocks.results.location,
        historical: WeatherAPIMocks.results.historical
      });
    }

    setIsError(false);
    setIsNoResult(false);
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
            // the api only return a success property if when it fails.
            if (parsedJson.results.success || parsedJson.results.success === false) {
              // Both errors are returned when the API when the query fails.
              // For these two code, we throw an error regarding the query.
              const code = parsedJson.results.error.code;
              if (code === 615 || code === 400) {
                console.error('Something wrong with the query requested');
                setIsNoResult(true)
              }
            } else {
              const results = parsedJson.results;
              setCurrentWeather({
                current: results.current,
                location: results.location,
                historical: results.historical
              });
              setCurrentLocation(results.location.name);
            }
          });
      }).catch((error) => {
        setIsError(true);
        console.error(error);
      });
  }

  async function getBackgroundImage(query: string) {
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

  useEffect(() => {
    if (currentWeather && currentWeather.location) {
      if (currentWeather.location.name !== currentLocation) {
        getBackgroundImage(currentWeather.location.name)
      }
    }
  }, [currentWeather, currentLocation]);

  useEffect(() => {
    let savedLocation = localStorage.getItem('location');
    if (savedLocation) {
      getWeather(savedLocation);
    } else {
      var options = {
        timeout: 5000,
        maximumWait: 1000,
        desiredAccuracy: 5000,
        fallbackToIP: true,
      };
      geolocator.locate(options, function (err: any, location: any) {
        if (err) return console.log(err);
        if (!location) {
          setMenuOpen(true);
        } else {
          const query = location.address && location.address.city ?
            location.address.city : location.coords.latitude + ',' + location.coords.longitude;
          localStorage.setItem('location', query);
          getWeather(query);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onValueChange() {
    if (isNoResult) {
      setIsNoResult(false);
    }
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

  function renderNewLocationForm() {
    return (
      <div>
        <SearchInput getweather={getWeather} valuechange={onValueChange} setmenuopen={setMenuOpen} />
        <p className='no-result'>{isNoResult ? `Can't find result, please try again.` : ''}</p>
        <Icon className={`search-close ${menuOpen ? 'active' : ''}`} onClick={() => { setMenuOpen(false) }} name='close' />
      </div>
    )
  }

  return (
    <div className="app" style={{ backgroundImage: `url(${locationBackgroundImage})` }}>
      <header className="app-header">
        <h1 className="logo">
          <Icon className='logo-icon rotating' name='sun' />
          Simply Weather
        </h1>
        <div className={`search-wrapper ${menuOpen ? 'active' : ''}`}>
          {menuOpen ? renderNewLocationForm() :
            <Icon className="search-toggle-icon" name='search' onClick={() => { setMenuOpen(true) }} />
          }
        </div>
      </header>
      {!currentWeather.location.name ?
        <div className="ui active centered inline loader"></div> : ''
      }
      {currentWeather.location.name ?
        <main className="app-main">
          {isError ? <div>Oops, something went wrong. <span style={{ textDecoration: 'underline', cursor: 'default' }} onClick={() => { getWeather(currentLocation) }}>Please try again.</span></div> :
            <WeatherDetails getWeather={getWeather} currentWeather={currentWeather} degreeUnit={{ degreeUnit, setDegreeUnit }} />
          }
        </main>
        : ''}
    </div>
  );
}

export default App;