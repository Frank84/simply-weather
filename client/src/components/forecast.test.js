import React from 'react';
import Forecast from './forecast';
import { shallow } from 'enzyme';

it('renders without crashing', () => {
  shallow(<Forecast />);
});