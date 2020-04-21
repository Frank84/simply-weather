import React, { useState, useEffect } from 'react'

import Forecast from './forecast';
import HistoricWeather from './historic-weather';

export default function WeatherDetails(props) {
  
  const currentWeather = props.currentWeather;
  const {degreeUnit, setDegreeUnit} = props.degreeUnit;
  const getWeather = props.getWeather;
  const [weatherDisplayMode, setWeatherDisplayMode] = useState('forecast');

  useEffect(() => {
    if (currentWeather && currentWeather.location) {
      getWeather(currentWeather.location.name);
      setWeatherDisplayMode('forecast');
    }
  }, [degreeUnit]);

  function displayLocationName(): string {
    if (currentWeather && currentWeather.location) {
      const region = currentWeather.location.region ? ', ' + currentWeather.location.region : '';
      return currentWeather.location.name + region;
    } else {
      return '';
    }
  }

  return (
    <>
      <h1 style={{ marginBottom: '0' }}>{ displayLocationName() }</h1>
      <div className="temperature">
        <span className="temperature-degree">{ currentWeather && currentWeather.current ? currentWeather.current.temperature : '' }</span>
        <div className="temperature-details">
          <span onClick={() => { setDegreeUnit('c') }} className={`${degreeUnit === 'c' ? 'active' : '' } temperature-unit temperature-celcius`}>°C</span>
          <span className="temperature-unit temperature-or">|</span>
          <span onClick={() => { setDegreeUnit('f') }} className={`${degreeUnit === 'f' ? 'active' : '' } temperature-unit temperature-fahrenheit`}>°F</span>
          <span className="temperature-feelslike">{ currentWeather && currentWeather.current ? 'Feels like ' + currentWeather.current.feelslike + '°' : '' }</span>
        </div>
      </div>
      <section>
        {  
          weatherDisplayMode === 'forecast' ?
          <Forecast nmbOfDays="7" historical={currentWeather.historical} /> :
          <HistoricWeather historical={currentWeather.historical} />
        }
        <div className="ui buttons mini">
          <button 
            onClick={() => { setWeatherDisplayMode('forecast' )}} 
            className={`${weatherDisplayMode === 'forecast' ? '' : 'inverted' } secondary ui button`}>
            Forecast
          </button>
          <button 
            onClick={() => { setWeatherDisplayMode('30days' )}} 
            className={`${weatherDisplayMode === '30days' ? '' : 'inverted' } secondary ui button`}>
            Past 30-Days
          </button>
        </div>
      </section>
    </>
  )
}
