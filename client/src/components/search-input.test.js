import React from 'react';
import SearchInput from './search-input';
import { shallow } from 'enzyme';

it('renders without crashing', () => {
  shallow(<SearchInput />);
});