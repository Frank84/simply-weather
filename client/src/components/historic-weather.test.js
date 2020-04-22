import React from 'react';
import HistoricWeather from './historic-weather';
import { shallow } from 'enzyme';

it('renders without crashing', () => {
  shallow(<HistoricWeather />);
});