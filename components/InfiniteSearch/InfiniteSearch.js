import React, { Component } from 'react';
import { connectInfiniteHits } from 'react-instantsearch-dom';


class InfiniteSearch extends Component {
  render() {
    const { hits } = this.props;

    return (
      <div className="ais-InfiniteHits">
        <ul className="ais-InfiniteHits-list">
          {hits.map(hit => (
            <li key={hit.objectID} className="ais-InfiniteHits-item">
              <span>{hit.name}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default connectInfiniteHits(InfiniteSearch);
