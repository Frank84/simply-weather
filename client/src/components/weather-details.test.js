import React from 'react';
import WeatherDetails from './search-input';
import { shallow } from 'enzyme';

it('renders without crashing', () => {
  shallow(<WeatherDetails />);
});