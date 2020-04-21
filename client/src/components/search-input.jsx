import _ from 'lodash'
import cities from '../utilities/cities.json';
import React, { Component } from 'react'
import { Search } from 'semantic-ui-react'

const initialState = { isLoading: false, results: [], value: '' }

export default class SearchExampleStandard extends Component {
  state = initialState

  searchNewLocation = async (e) => {
    this.setState({ isLoading: true });
    e.preventDefault();
    await this.props.getweather(this.state.value);
    this.setState({ isLoading: false });
    this.props.setmenuopen(false);
  }

  handleResultSelect = (e, { result }) => this.setState({ value: result.title })

  handleSearchChange = (e, { value }) => {
    this.setState({ isLoading: true, value });
    this.props.valuechange(value);

    setTimeout(() => {
      if (value.length < 4) return this.setState({ isLoading: false  });
      if (this.state.value.length < 1) return this.setState(initialState)

      const re = new RegExp(_.escapeRegExp(this.state.value), 'i')
      const isMatch = (result) => re.test(result.title)

      this.setState({
        isLoading: false,
        results: _.filter(cities, isMatch),
      })
    }, 300)
  }

  render() {
    const { isLoading, value, results } = this.state;

    return (
      <form onSubmit={this.searchNewLocation}>
        <Search
          loading={isLoading}
          onResultSelect={this.handleResultSelect}
          onSearchChange={_.debounce(this.handleSearchChange, 500, {
            leading: true,
          })}
          placeholder="Search for a city"
          results={results}
          value={value}
          {...this.props}
        />
      </form>
    )
  }
}