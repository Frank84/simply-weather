import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import WeatherDetails from './search-input';

it('renders correctly', () => {
  const wrapper = shallow(<WeatherDetails />)
  expect(toJson(wrapper)).toMatchSnapshot();
});