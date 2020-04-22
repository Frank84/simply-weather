import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import SearchInput from './search-input';

it('renders properly', () => {
  const wrapper = shallow(<SearchInput />)
  expect(toJson(wrapper)).toMatchSnapshot();
});