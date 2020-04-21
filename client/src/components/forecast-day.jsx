import React, { useEffect, useState } from 'react'
import moment from 'moment';

import { getRandomInt } from '../utilities/utils';
import weatherCloudIcon from '../images/cloud.svg';
import weatherCloudSunIcon from '../images/cloud-sun.svg';
import weatherCloudRainIcon from '../images/rain.svg';
import weatherSunIcon from '../images/sun.svg';
import weatherWindyIcon from '../images/windy.svg';
import weatherDripIcon from '../images/drip.svg';
import weatherCloudLightningIcon from '../images/cloud-lightning.svg';

export default function ForecastDay(props) {
  const weatherIcons = [weatherCloudIcon, weatherCloudSunIcon, weatherCloudRainIcon, weatherSunIcon, weatherWindyIcon, weatherDripIcon, weatherCloudLightningIcon];
  const [weatherIcon, setWeatherIcon] = useState();

  useEffect(() => {
    // Since we are using the free version of the Weather API, 
    // We only have historical data without any visual weather icons.
    // For the purpose of this app, we are displaying a random icon for each day.
    setWeatherIcon(weatherIcons[getRandomInt(weatherIcons.length)]);
  }, []);

  return (
    <section style={styles.container}>
      <header>{moment(props.date).format('ddd')}</header>
      <img width="40" alt="Weather Icon" style={styles.icon} src={weatherIcon} />
      <p style={styles.temperature}>
        <span style={styles.max}>{props.max}°</span>
        <span style={styles.min}>{props.low}°</span>
      </p>
    </section>
  )
}

const styles = {
  container: {
    border: 'solid 2px rgba(255,255,255,0.7)',
    margin: '0 0.5rem',
    padding: '0.5rem',
    borderRadius: '0.6rem',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  icon: {
    margin: 'auto',
  },
  temperature: {
    textAlign: 'center',
  },
  max: {
    paddingRight: '0.5rem',
  },
  min: {
    color: '#999',
  }
}
