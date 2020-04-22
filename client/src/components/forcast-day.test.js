import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import ForecastDay from './forecast-day';
import React from 'react';

it('renders properly', () => {
  const wrapper = shallow(<ForecastDay />);
  expect(toJson(wrapper)).toMatchSnapshot();
});