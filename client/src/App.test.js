import App from './App';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';

it('renders properly', () => {
  const wrapper = shallow(<App />);
  expect(toJson(wrapper)).toMatchSnapshot();
});