import React from 'react'

import ForecastDay from './forecast-day';

export default function Forecast(props) {
  // Since we are using the free version of the Weather API, 
  // We don't have access to the forecast data. 
  // For the purpose of this app, we are displaying historical days for the forecast .
  const historical = props.historical;
  
  return (
    <div className="forecast">
      {historical ? Object.keys(historical).map((day, i) => {
        if (i < props.nmbOfDays) {
          return (<ForecastDay key={i} max={historical[day].maxtemp} low={historical[day].mintemp} date={historical[day].date} />)
        } else { return null }
      }): ''}
    </div>
  )
}