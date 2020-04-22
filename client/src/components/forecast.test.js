import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import Forecast from './forecast';
import React from 'react';

it('renders properly', () => {
  const wrapper = shallow(<Forecast />);
  expect(toJson(wrapper)).toMatchSnapshot();
});