import React from 'react';
import SearchList from './SearchList';
import ListFilter from './ListFilter';
import Search from './Search';
import OopsMessage from './OopsMessage';

class Root extends React.Component {
  constructor(props) {
    super(props);
    this.fetchQuery = this.fetchQuery.bind(this);
    this.updateSearchTerm = this.updateSearchTerm.bind(this);
    this.state = {
      searchTerm: '',
      searchResults: [],
      previousResults: [],
      noData: false,
      makeSelection: false,
    };
  }

  componentDidMount() {
    this.fetchQuery();
  }

  fetchQuery(e) {
    const { searchTerm, previousResults, searchResults } = this.state;
    if (searchTerm.length === 0) { return; }
    const history = [...searchResults, ...previousResults];

    fetch(`/location/search/query/${searchTerm}`)
      .then(res => res.json())
      .then((d) => {
        this.setState({
          searchTerm: '',
          previousResults: history,
          noData: false,
          makeSelection: d.length > 1,
          searchResults: [d],
        });
      })
      .catch((err) => {
        this.setState({
          searchResults: [],
          searchTerm: '',
          previousResults: history,
          noData: true,
        });
      });
  }

  updateSearchTerm(e) {
    this.setState({ searchTerm: e.target.value });
  }

  render() {
    const {
      searchResults, previousResults, searchTerm, noData, makeSelection,
    } = this.state;

    return (
      <div>
        <div>
          <Search
            update={this.updateSearchTerm}
            initiate={this.fetchQuery}
            term={searchTerm}
          />
        </div>
        <div>
          {noData
            ? <OopsMessage />
            : <ListFilter searchResults={searchResults} select={makeSelection} />
          }
        </div>
        <div>
          <SearchList searchResults={previousResults} />
        </div>
      </div>
    );
  }
}

export default Root;
