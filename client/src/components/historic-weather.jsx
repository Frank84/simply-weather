import Chart from 'chart.js';
import moment from 'moment';
import React, { useEffect } from 'react';

export default function HistoricWeather(props) {
  const historical = props.historical;
  
  useEffect(() => {
    console.log('calling');
    // Generating the canvas graph using chartjs
    let ctx = document.getElementById('myChart').getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
          labels: Object.keys(historical).map((day) => {
            return moment(historical[day].date).date();
          }),
          datasets: [{
              label: 'Max. Temperature',
              data: Object.keys(historical).map((day) => {
                return historical[day].maxtemp;
              }),
              borderColor: 'rgba(255,255,255,1)',
              borderWidth: 1,
            },
            {
              label: 'Min. Temperature',
              data: Object.keys(historical).map((day) => {
                return historical[day].mintemp;
              }),
              borderColor: 'rgba(255,255,255,1)',
              borderWidth: 1,
            }
          ]
      },
      options: {
          title: {
            display: false,
            text: 'Max./Min. temperatures for the past 30 days',
            fontColor: '#FFF',
          },
          legend: {
            display: false,
          },
          scales: {
              yAxes: [{
                gridLines: {
                  color: 'rgba(255,255,255,0.1)',
                },
                ticks: {
                  maxTicksLimit: 5,
                  fontColor: '#FFF',
                }
              }],
              xAxes: [{
                gridLines: {
                  color: 'rgba(255,255,255,0.1)',
                },
                ticks: {
                  maxTicksLimit: 5,
                  fontColor: '#FFF',
                  maxRotation: 0,
                  minRotation: 0
                }
              }]
          }
      }
  });
  }, [historical])
  
  return (
    <>
      <canvas style={styles.chart} id="myChart" height="100"></canvas>
    </>
  )
}

const styles = {
  chart: {
    width: '100%',
    maxWidth: '400px',
    marginBottom: '1rem',
  }
}