import React from 'react';
import ForecastDay from './forecast-day';
import { shallow } from 'enzyme';

it('renders without crashing', () => {
  shallow(<ForecastDay />);
});