import React, { Component } from 'react';
import { connect } from 'react-redux';

// Component
import Main from './Main';

// Utility Functions
import { setCard, setSales, setUser } from '../../redux/actionCreators';
import { searchCard, configureSearchTerm } from '../../util/algolia/algoliaHelpers';
import pokeCard from '../../util/api/card';
import { getSalesForCard } from '../../util/api/sales';
import { getCardInfo } from '../../util/pokemonAPI/pokemonAPI';


class MainContainer extends Component {

  componentDidMount = () => {
    this.setUpComponent();
  }

  componentDidUpdate = (prevProps) => {
    // if (prevProps.listing.title !== this.props.listing.title) { // if there's a new listing that wasn't there before
    //   this.setUpComponent();
    // } else if (this.props.listing.title && !this.props.card.id) { // if there is a listing and not a card yet
    //   this.setUpComponent();
    // }
  }

  setUpComponent = async () => {
    try {
      let card = await this.findCard();
      this.getSalesData(card ? card.id : null);
      if (card && !card.image_url) {
        this.getCardImage(card);
      }
    } catch(error) {
      console.error(error);
    }
  }

  findCard = async () => {
    try {
      // let searchTerm = configureSearchTerm();
      let searchTerm = 'Pikachu';
      let results = await searchCard(searchTerm);
      let card = {};
      if (results && results.length > 0) {
        card = await pokeCard.get(results[0].objectID);
      }
      await this.props.setCard(card);
      return Promise.resolve(card);
    } catch(error) {
      console.error(error)
    }
  }

  getSalesData = async (card_id) => {
    try {
      if (card_id) {
        let sales = await getSalesForCard(card_id);
        this.props.setSales(sales);
      }
    } catch(error) {
      console.error(error)
    }
  }

  getCardImage = async (card) => {
    try {
      let cardInfo = await getCardInfo(card);

      let updates = {
        image_url: cardInfo.imageUrl || null
      }

      console.log('got card info ', cardInfo);

      await pokeCard.update(card.id, updates);

      let updatedCard = { ...card, ...updates };
      await this.props.setCard(updatedCard);
    } catch(error) {
      console.error(error)
    }
  }

  render() {
    return (
      <Main user={this.props.user} card={this.props.card} sales={this.props.sales} />
    );
  }
}




const mapStateToProps = state => {
  return {
    user: state.user,
    card: state.card,
    sales: state.sales,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setUser: user => dispatch(setUser(user)),
    setCard: details => dispatch(setCard(details)),
    setSales: sales => dispatch(setSales(sales))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MainContainer);
