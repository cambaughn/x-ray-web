import React, { Component } from 'react';
import styles from './App.module.scss';
import { connect } from 'react-redux';

// Components
import MainContainer from '../Main/MainContainer';
import SubscribeContainer from '../Subscribe/SubscribeContainer';
import Login from '../Login/Login';

// Utility Functions
import { setListing, setCard, setSales, setUser } from '../../redux/actionCreators';
import { searchCard, configureSearchTerm } from '../../util/algolia/algoliaHelpers';
import pokeCard from '../../util/api/card';
import { getSalesForCard } from '../../util/api/sales';
import { getCardInfo } from '../../util/pokemonAPI/pokemonAPI';


class App extends Component {
  render() {
    return (
      <div className={styles.container}>
        {/* <h2 className={styles.brand}>X-ray</h2> */}
        <div className={styles.topBanner}>
          {/* <img src={require('../../assets/images/wordmark.png')} alt={'wordmark'} className={styles.brand} /> */}
        </div>
        {/* { !this.props.user.id &&
          <Login setUser={this.props.setUser} />
        } */}

          <MainContainer />

        {/* { this.props.user.id && this.props.user.status !== 'subscribed' &&
          <SubscribeContainer />
        } */}

      </div>
    );
  }
}




const mapStateToProps = state => {
  return {
    user: state.user,
    listing: state.listing,
    card: state.card,
    sales: state.sales,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setUser: user => dispatch(setUser(user)),
    setListing: details => dispatch(setListing(details)),
    setCard: details => dispatch(setCard(details)),
    setSales: sales => dispatch(setSales(sales))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
