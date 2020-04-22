import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import HistoricWeather from './historic-weather';

it('renders properly', () => {
  const wrapper = shallow(<HistoricWeather />);
  expect(toJson(wrapper)).toMatchSnapshot();
});