import React, { Component } from 'react';
import { connect } from 'react-redux';

// Components
import CardImage from './CardImage';

// Utility Functions
import { setCard } from '../../redux/actionCreators';


class CardImageContainer extends Component {

  constructor(props) {
    super(props);

    this.state = {

    }
  }

  render() {
    return (
      <CardImage />
    );
  }
}




const mapStateToProps = state => {
  return {
    user: state.user,
    card: state.card
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setCard: card => dispatch(setCard(card))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CardImageContainer);
